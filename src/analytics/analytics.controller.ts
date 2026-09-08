import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service.js";
import { Roles } from "../common/decorator/roles.decorator.js";
import { CurrentUser } from "../common/decorator/current-user.decorator.js";
import { UserRole } from "../common/enums/user.role.enum.js";
import { VendorsService } from "../vendors/vendors.service.js";

@ApiTags("Analytics")
@ApiBearerAuth()
@Controller("analytics")
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly vendorsService: VendorsService,
  ) {}

  /** Admin / Super Admin: full platform view */
  @Get("platform")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getPlatformDashboard() {
    return this.analyticsService.getPlatformDashboard();
  }

  /** Admin: custom date-range platform summary */
  @Get("platform/summary")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  getPlatformSummary(
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    return this.analyticsService.getSalesSummary(new Date(from), new Date(to));
  }

  /** Admin / Super Admin: top vendors by revenue */
@Get("platform/top-vendors")
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
getPlatformTopVendors(
  @Query("from") from: string,
  @Query("to") to: string,
) {
  return this.analyticsService.getTopVendors(
    new Date(from),
    new Date(to),
  );
}

  /** Vendor: their own dashboard */
  @Get("vendor/dashboard")
  @Roles(UserRole.VENDOR)
  async getVendorDashboard(@CurrentUser("id") userId: string) {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.analyticsService.getVendorDashboard(vendor.id);
  }

  /** Vendor: custom date range */
  @Get("vendor/summary")
  @Roles(UserRole.VENDOR)
  async getVendorSummary(
    @CurrentUser("id") userId: string,
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.analyticsService.getSalesSummary(new Date(from), new Date(to), vendor.id);
  }

  /** Vendor: top products */
  @Get("vendor/top-products")
  @Roles(UserRole.VENDOR)
  async getVendorTopProducts(
    @CurrentUser("id") userId: string,
    @Query("from") from: string,
    @Query("to") to: string,
  ) {
    const vendor = await this.vendorsService.findByUserId(userId);
    return this.analyticsService.getTopProducts(new Date(from), new Date(to), vendor.id);
  }
}
