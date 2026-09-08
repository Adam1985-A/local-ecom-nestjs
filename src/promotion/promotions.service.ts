import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './coupon.entity.js';
import { CreateCouponDto } from './dto/create-coupon.dto.js';
import { ValidateCouponDto } from './dto/validate-coupon.dto.js';
import { CouponType } from '../common/enums/coupon-type.enum.js';
import { BusinessException } from '../common/exception/business.exception.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { paginate } from '../common/utils/pagination.util.js';
import type { PaginatedResult } from '../common/type/pagination.types.js';

export interface CouponCalculation {
  coupon: Coupon;
  discountAmount: number;
  freeDelivery: boolean;
}

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const code = dto.code.toUpperCase();
    const existing = await this.couponRepository.findOne({ where: { code } });
    if (existing) throw new ConflictException(`Coupon code "${code}" already exists`);

    return this.couponRepository.save(
      this.couponRepository.create({
        ...dto,
        code,
        startsAt: new Date(dto.startsAt),
        expiresAt: new Date(dto.expiresAt),
      }),
    );
  }

  findAll(query: PaginationQueryDto): Promise<PaginatedResult<Coupon>> {
    const qb = this.couponRepository
      .createQueryBuilder('coupon')
      .leftJoinAndSelect('coupon.vendor', 'vendor')
      .orderBy('coupon.createdAt', 'DESC');

    if (query.search) {
      qb.where('coupon.code ILIKE :search', { search: `%${query.search}%` });
    }

    const options = {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
};

return paginate(qb, options);
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase() },
      relations: {
        vendor: true,
      },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  /**
   * Validates a coupon against the current order context and returns the
   * calculated discount amounts. Throws BusinessException for any invalid state.
   */
  async validate(dto: ValidateCouponDto): Promise<CouponCalculation> {
    const coupon = await this.findByCode(dto.code);

    if (!coupon.isValid) {
      throw new BusinessException(
        'This coupon is expired, inactive, or has reached its usage limit',
      );
    }

    if (coupon.vendorId && coupon.vendorId !== dto.vendorId) {
      throw new BusinessException('This coupon is not valid for the selected vendor');
    }

    if (dto.orderSubtotal < Number(coupon.minimumOrderAmount)) {
      throw new BusinessException(
        `Minimum order amount of ₦${Number(coupon.minimumOrderAmount).toFixed(2)} required for this coupon`,
      );
    }

    let discountAmount = 0;
    let freeDelivery = false;

    switch (coupon.type) {
      case CouponType.PERCENTAGE:
        discountAmount = (dto.orderSubtotal * Number(coupon.discountValue)) / 100;
        break;
      case CouponType.FIXED_AMOUNT:
        discountAmount = Math.min(Number(coupon.discountValue), dto.orderSubtotal);
        break;
      case CouponType.FREE_DELIVERY:
        freeDelivery = true;
        break;
    }

    return { coupon, discountAmount, freeDelivery };
  }

  /** Increments the usage counter after a successful order placement. */
  async incrementUsage(couponCode: string): Promise<void> {
    await this.couponRepository
      .createQueryBuilder()
      .update(Coupon)
      .set({ usageCount: () => 'usage_count + 1' })
      .where('code = :code', { code: couponCode.toUpperCase() })
      .execute();
  }

  async deactivate(id: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    coupon.isActive = false;
    return this.couponRepository.save(coupon);
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    await this.couponRepository.softRemove(coupon);
  }
}
