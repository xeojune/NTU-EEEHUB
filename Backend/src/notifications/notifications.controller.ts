import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './schemas/notifications.schema';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Query('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    this.logger.debug(`Getting notifications for userId: ${userId}, page: ${page}, limit: ${limit}`);
    const result = await this.notificationsService.getNotificationsForUser(userId, page, limit);
    this.logger.debug('Notifications result:', result);
    return result;
  }

  @Get('unread/count')
  async getUnreadCount(@Query('userId') userId: string) {
    this.logger.debug(`Getting unread count for userId: ${userId}`);
    const count = await this.notificationsService.getUnreadCount(userId);
    this.logger.debug(`Unread count: ${count}`);
    return { count };
  }

  @Post()
  async createNotification(
    @Body() createNotificationDto: {
      recipientId: string | string[];
      senderId: string;
      type: NotificationType;
      content: string;
      entityId?: string;
      entityType?: string;
    },
  ) {
    this.logger.debug('Creating notification with data:', JSON.stringify(createNotificationDto, null, 2));
    try {
      // Convert single recipientId to array if needed
      const recipients = Array.isArray(createNotificationDto.recipientId) 
        ? createNotificationDto.recipientId 
        : [createNotificationDto.recipientId];
      
      this.logger.debug('Processed recipients:', recipients);

      const result = await this.notificationsService.createNotification(
        recipients,
        createNotificationDto.senderId,
        createNotificationDto.type,
        createNotificationDto.content,
        createNotificationDto.entityId,
        createNotificationDto.entityType,
      );
      this.logger.debug('Created notification:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      this.logger.error('Error in createNotification:', error);
      this.logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  @Post(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body() body: { userId: string }
  ) {
    this.logger.debug(`Marking notification ${id} as read for user ${body.userId}`);
    if (!body.userId) {
      throw new Error('userId is required');
    }
    return this.notificationsService.markAsRead(id, body.userId);
  }

  @Post('read/all')
  async markAllAsRead(@Body() body: { userId: string }) {
    this.logger.debug(`Marking all notifications as read for userId: ${body.userId}`);
    await this.notificationsService.markAllAsRead(body.userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    this.logger.debug(`Deleting notification ${id}`);
    await this.notificationsService.deleteNotification(id);
    return { message: 'Notification deleted successfully' };
  }
}