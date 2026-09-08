import { Module } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service.js";
import { AnalyticsController } from "./analytics.controller.js";
import { VendorsModule } from "../vendors/vendor.module.js";

@Module({
  imports: [VendorsModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
