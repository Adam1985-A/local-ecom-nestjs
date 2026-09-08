import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service.js";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Get current user's notifications
   *
   * GET /api/v1/notifications?page=1&limit=10
   */
  @Get()
  async findAll(
    @Req() req: any,
    @Query() query: PaginationQueryDto,
  ) {
    return this.notificationsService.findAll(
      req.user.id,
      query,
    );
  }

  /**
   * Get unread notification count
   *
   * GET /api/v1/notifications/unread-count
   */
  @Get("unread-count")
  async countUnread(@Req() req: any) {
    const count = await this.notificationsService.countUnread(
      req.user.id,
    );

    return {
      count,
    };
  }

  /**
   * Mark one notification as read
   *
   * PATCH /api/v1/notifications/:id/read
   */
  @Patch(":id/read")
  async markRead(
    @Param("id") id: string,
    @Req() req: any,
  ) {
    return this.notificationsService.markRead(
      id,
      req.user.id,
    );
  }

  /**
   * Mark all current user's notifications as read
   *
   * PATCH /api/v1/notifications/read-all
   */
  @Patch("read-all")
  async markAllRead(@Req() req: any) {
    await this.notificationsService.markAllRead(
      req.user.id,
    );

    return {
      success: true,
      message: "All notifications marked as read",
    };
  }
}

