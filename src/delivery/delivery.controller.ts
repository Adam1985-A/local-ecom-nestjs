import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DeliveryService } from "./delivery.service.js";
import { AssignRiderDto } from "./dto/assign-rider.dto.js";
import { ConfirmDeliveryDto } from "./dto/confirm-delivery.dto.js";
import { CurrentUser } from "../common/decorator/current-user.decorator.js";
import { Roles } from "../common/decorator/roles.decorator.js";
import { UserRole } from "../common/enums/user.role.enum.js";
import { DeliveryStatus } from "../common/enums/delivery-status.enum.js";

@ApiTags("Delivery")
@ApiBearerAuth()
@Controller("delivery")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  /** Admin assigns a rider to a pending delivery */
  @Post(":id/assign-rider")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  assignRider(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: AssignRiderDto,
  ) {
    return this.deliveryService.assignRider(id, dto.riderId);
  }

  /** Rider marks parcel as picked up from vendor */
  @Patch(":id/pickup")
  @Roles(UserRole.RIDER)
  pickup(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") riderId: string,
  ) {
    return this.deliveryService.updateStatus(
      id,
      DeliveryStatus.PICKED_UP,
      riderId,
    );
  }

  /** Customer confirms delivery by providing the OTP shown in their app */
  @Post(":id/confirm")
  confirmDelivery(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: ConfirmDeliveryDto,
  ) {
    return this.deliveryService.confirmDelivery(id, dto.otp);
  }

  /** Get delivery record for a specific order */
  @Get("order/:orderId")
  findByOrder(@Param("orderId", ParseUUIDPipe) orderId: string) {
    return this.deliveryService.findByOrder(orderId);
  }

  /** Rider: get all deliveries currently assigned to them */
  @Get("my-deliveries")
  @Roles(UserRole.RIDER)
  getMyDeliveries(@CurrentUser("id") userId: string) {
    return this.deliveryService.findRiderActiveDeliveries(userId);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.deliveryService.findById(id);
  }
}
