import {
  Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service.js";
import { CreateReviewDto } from "./dto/create-review.dto.js";
import { CurrentUser } from "../common/decorator/current-user.decorator.js";
import { Roles } from "../common/decorator/roles.decorator.js";
import { Public } from "../common/decorator/public.decorator.js";
import { UserRole } from "../common/enums/user.role.enum.js";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto.js";

@ApiTags("Reviews")
@ApiBearerAuth()
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  create(@CurrentUser("id") userId: string, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(userId, dto);
  }

  @Get("me")
  getMyReviews(
    @CurrentUser("id") userId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findMyReviews(userId, query);
  }

  @Public()
  @Get("vendor/:vendorId")
  forVendor(
    @Param("vendorId", ParseUUIDPipe) vendorId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findForVendor(vendorId, query);
  }

  @Public()
  @Get("product/:productId")
  forProduct(
    @Param("productId", ParseUUIDPipe) productId: string,
    @Query() query: PaginationQueryDto,
  ) {
    return this.reviewsService.findForProduct(productId, query);
  }

  @Patch(":id/visibility")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  toggleVisibility(@Param("id", ParseUUIDPipe) id: string) {
    return this.reviewsService.toggleVisibility(id);
  }
}



