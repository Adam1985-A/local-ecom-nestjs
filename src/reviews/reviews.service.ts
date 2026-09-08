import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Review } from "./review.entity.js";
import { CreateReviewDto } from "./dto/create-review.dto.js";
import { VendorsService } from "../vendors/vendors.service.js";
import { ProductsService } from "../products/products.service.js";
import { OrdersService } from "../orders/orders.service.js";
import { OrderStatus } from "../common/enums/order-status.enum.js";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto.js";
import { paginate } from "../common/utils/pagination.util.js";
import type { PaginatedResult } from "../common/type/pagination.types.js";
import { BusinessException } from "../common/exception/business.exception.js";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly vendorsService: VendorsService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  async create(customerId: string, dto: CreateReviewDto): Promise<Review> {
    const order = await this.ordersService.findById(dto.orderId);

    if (order.customerId !== customerId) {
      throw new ForbiddenException("This order does not belong to you");
    }
    if (order.status !== OrderStatus.DELIVERED) {
      throw new BusinessException("You can only review delivered orders");
    }

    const existing = await this.reviewRepository.findOne({
      where: { customerId, orderId: dto.orderId, vendorId: dto.vendorId },
    });
    if (existing) {
      throw new ConflictException("You have already reviewed this order");
    }

    const review = await this.reviewRepository.save(
      this.reviewRepository.create({ ...dto, customerId }),
    );

    await this.recalculateVendorRating(dto.vendorId);
    if (dto.productId) await this.recalculateProductRating(dto.productId);

    return review;
  }

  findForVendor(vendorId: string, query: PaginationQueryDto): Promise<PaginatedResult<Review>> {
    const qb = this.reviewRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.customer", "customer")
      .leftJoinAndSelect("review.product", "product")
      .where("review.vendorId = :vendorId", { vendorId })
      .andWhere("review.isVisible = true")
      .orderBy("review.createdAt", "DESC");
    return paginate(qb, {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
});
  }

  findForProduct(productId: string, query: PaginationQueryDto): Promise<PaginatedResult<Review>> {
    const qb = this.reviewRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.customer", "customer")
      .where("review.productId = :productId", { productId })
      .andWhere("review.isVisible = true")
      .orderBy("review.createdAt", "DESC");
    return paginate(qb, {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
});
  }

  findMyReviews(customerId: string, query: PaginationQueryDto) {
    const qb = this.reviewRepository
      .createQueryBuilder("review")
      .leftJoinAndSelect("review.vendor", "vendor")
      .leftJoinAndSelect("review.product", "product")
      .where("review.customerId = :customerId", { customerId })
      .orderBy("review.createdAt", "DESC");
    return paginate(qb, {
  ...(query.page !== undefined && { page: query.page }),
  ...(query.limit !== undefined && { limit: query.limit }),
});
  }

  async toggleVisibility(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException("Review not found");
    review.isVisible = !review.isVisible;
    return this.reviewRepository.save(review);
  }

  private async recalculateVendorRating(vendorId: string): Promise<void> {
    const result = await this.reviewRepository
      .createQueryBuilder("r")
      .select("AVG(r.rating)", "avg")
      .addSelect("COUNT(*)", "count")
      .where("r.vendorId = :vendorId", { vendorId })
      .andWhere("r.isVisible = true")
      .getRawOne<{ avg: string; count: string }>();
    await this.vendorsService.updateRating(
      vendorId,
      parseFloat(result?.avg ?? "0"),
      parseInt(result?.count ?? "0", 10),
    );
  }

  private async recalculateProductRating(productId: string): Promise<void> {
    const result = await this.reviewRepository
      .createQueryBuilder("r")
      .select("AVG(r.rating)", "avg")
      .addSelect("COUNT(*)", "count")
      .where("r.productId = :productId", { productId })
      .andWhere("r.isVisible = true")
      .getRawOne<{ avg: string; count: string }>();
    await this.productsService.updateRating(
      productId,
      parseFloat(result?.avg ?? "0"),
      parseInt(result?.count ?? "0", 10),
    );
  }
}




