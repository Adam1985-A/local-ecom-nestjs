import { IsArray, IsUUID } from 'class-validator';

export class MarkNotificationsReadDto {
  /**
   * Array of notification IDs to mark as read.
   * Pass an empty array to mark ALL unread notifications as read.
   */
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];
}