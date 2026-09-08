import {
  Body, Controller, Delete, Get, Param, ParseUUIDPipe,
  Patch, Post, Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PromotionsService } from "./promotions.service.js";
import { CreateCouponDto } from "./dto/create-coupon.dto.js";
import { ValidateCouponDto } from "./dto/validate-coupon.dto.js";
import { Roles } from "../common/decorator/roles.decorator.js";
import { UserRole } from "../common/enums/user.role.enum.js";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto.js";

@ApiTags("Promotions")
@ApiBearerAuth()
@Controller("promotions")
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post("coupons")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  create(@Body() dto: CreateCouponDto) {
    return this.promotionsService.create(dto);
  }

  @Get("coupons")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  findAll(@Query() query: PaginationQueryDto) {
    return this.promotionsService.findAll(query);
  }

  /** Customers call this to validate a coupon before checkout. */
  @Post("coupons/validate")
  validate(@Body() dto: ValidateCouponDto) {
    return this.promotionsService.validate(dto);
  }

  @Patch("coupons/:id/deactivate")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  deactivate(@Param("id", ParseUUIDPipe) id: string) {
    return this.promotionsService.deactivate(id);
  }

  @Delete("coupons/:id")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.promotionsService.remove(id);
  }
}
