import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { randomInt } from "crypto";
import { Delivery } from "./delivery.entity.js";
import { RidersService } from "../riders/riders.service.js";
import { OrdersService } from "../orders/orders.service.js";
import { WalletService } from "../wallet/wallet.service.js";
import { DeliveryStatus } from "../common/enums/delivery-status.enum.js";
import { OrderStatus } from "../common/enums/order-status.enum.js";
import { RiderStatus } from "../common/enums/rider-status.enum.js";
import { WalletTransactionSource } from "../common/enums/wallet-transaction-source.enum.js";
import { BusinessException } from "../common/exception/business.exception.js";

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    private readonly ridersService: RidersService,
    private readonly ordersService: OrdersService,
    private readonly walletService: WalletService,
  ) {}

  async createForOrder(orderId: string, deliveryFee: number): Promise<Delivery> {
    const existing = await this.deliveryRepository.findOne({ where: { orderId } });
    if (existing) return existing;

    const delivery = this.deliveryRepository.create({
      orderId,
      deliveryFee,
      status: DeliveryStatus.PENDING,
      handoverOtp: String(randomInt(1000, 9999)).padStart(4, "0"),
    });
    return this.deliveryRepository.save(delivery);
  }

  async assignRider(deliveryId: string, riderId: string): Promise<Delivery> {
    const delivery = await this.findById(deliveryId);
    const rider = await this.ridersService.findById(riderId);

    if (!rider.isVerified) throw new BusinessException("Rider is not verified");
    if (rider.status !== RiderStatus.AVAILABLE) throw new BusinessException("Rider is not available");

    /**
     * IMPORTANT: set BOTH the raw FK column AND the relation object.
     * Setting only delivery.riderId causes TypeORM to overwrite it with
     * the stale null from the in-memory relation object on save().
     */
    delivery.riderId = riderId;
    delivery.rider = rider;
    delivery.status = DeliveryStatus.ASSIGNED;
    delivery.assignedAt = new Date();
    delivery.riderEarnings = Number(delivery.deliveryFee) * 0.8; // 80% to rider

    await this.ridersService.updateStatus(rider.userId, { status: RiderStatus.ON_DELIVERY });

    return this.deliveryRepository.save(delivery);
  }

  async updateStatus(
    deliveryId: string,
    status: DeliveryStatus,
    riderUserId?: string,
  ): Promise<Delivery> {
    const delivery = await this.findById(deliveryId);

    // Guard: only the assigned rider can move the delivery forward
    if (riderUserId && delivery.rider?.userId !== riderUserId) {
      throw new UnauthorizedException("You are not assigned to this delivery");
    }

    delivery.status = status;

    if (status === DeliveryStatus.PICKED_UP) {
      delivery.pickedUpAt = new Date();
      // Use the internal bypass method — DeliveryService has already verified
      // the rider via the guard above; applying the public endpoint's
      // customer/vendor/admin rules here would incorrectly reject the call.
      await this.ordersService.setStatusInternal(
        delivery.orderId,
        OrderStatus.OUT_FOR_DELIVERY,
      );
    }

    return this.deliveryRepository.save(delivery);
  }

  async confirmDelivery(deliveryId: string, otp: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository
      .createQueryBuilder("d")
      .addSelect("d.handoverOtp")
      .leftJoinAndSelect("d.rider", "rider")
      .where("d.id = :id", { id: deliveryId })
      .getOne();

    if (!delivery) throw new NotFoundException("Delivery not found");
    if (delivery.handoverOtp !== otp) throw new BusinessException("Invalid OTP");

    delivery.status = DeliveryStatus.DELIVERED;
    delivery.deliveredAt = new Date();
    delivery.handoverOtp = null;
    const saved = await this.deliveryRepository.save(delivery);

    // Transition order via the trusted internal path
    await this.ordersService.setStatusInternal(delivery.orderId, OrderStatus.DELIVERED);

    // Credit rider earnings
    if (delivery.riderId && delivery.rider && Number(delivery.riderEarnings) > 0) {
      await this.walletService.credit({
        userId: delivery.rider.userId,
        amount: Number(delivery.riderEarnings),
        source: WalletTransactionSource.RIDER_EARNING,
        description: "Rider earnings for delivery " + deliveryId,
        relatedId: deliveryId,
      });
      await this.ridersService.incrementDeliveryCount(delivery.riderId);
      await this.ridersService.updateStatus(delivery.rider.userId, {
        status: RiderStatus.AVAILABLE,
      });
    }

    return saved;
  }

  async findById(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id },
      relations: {
        order: true,
        rider: {
          user: true,
        },
      },
    });
    if (!delivery) throw new NotFoundException("Delivery not found");
    return delivery;
  }

  async findByOrder(orderId: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { orderId },
      relations: {
        rider: {
          user: true,
        },
      },
    });
    if (!delivery) throw new NotFoundException("Delivery not found");
    return delivery;
  }

  async findRiderActiveDeliveries(userId: string): Promise<Delivery[]> {
    const rider = await this.ridersService.findByUserId(userId);

  if (!rider) {
    throw new NotFoundException("Rider profile not found");
  }

    return this.deliveryRepository.find({
      where: [

      { 
        riderId: rider.id, 
        status: DeliveryStatus.ASSIGNED 

      },

      {
        riderId: rider.id,
        status: DeliveryStatus.PICKED_UP,
      },

     {
        riderId: rider.id,
        status: DeliveryStatus.EN_ROUTE,
      }, 

      
    ],
      relations: {
        order: true,
      },

      order: {
      createdAt: "DESC",
    },

    });
  }
}
