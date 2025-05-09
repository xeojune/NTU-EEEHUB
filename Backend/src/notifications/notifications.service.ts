import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType, NotificationScope } from './schemas/notifications.schema';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(
    recipientIds: string[],
    senderId: string,
    type: NotificationType,
    content: string,
    entityId?: string,
    entityType?: string,
  ): Promise<NotificationDocument> {
    try {
      this.logger.debug('Creating notification with params:', {
        recipientIds,
        senderId,
        type,
        content,
        entityId,
        entityType
      });

      // Validate required fields
      if (!recipientIds.length || !senderId || !type || !content) {
        throw new Error('Missing required fields for notification creation');
      }

      // Create notification document
      const notification = new this.notificationModel({
        recipients: recipientIds,
        sender: senderId,
        type,
        scope: recipientIds.length > 1 ? NotificationScope.FOLLOWERS : NotificationScope.SINGLE,
        content,
        entityId,
        entityType,
        read: recipientIds.map(() => false),
      });

      this.logger.debug('Attempting to save notification:', notification);

      try {
        const savedNotification = await notification.save();
        this.logger.debug('Successfully saved notification:', savedNotification);
        return savedNotification;
      } catch (saveError) {
        this.logger.error('Error saving notification:', {
          error: saveError,
          document: notification
        });
        throw saveError;
      }
    } catch (error) {
      this.logger.error('Error in createNotification:', {
        error,
        stack: error.stack,
        params: {
          recipientIds,
          senderId,
          type,
          content,
          entityId,
          entityType
        }
      });
      throw error;
    }
  }

  async getNotificationsForUser(userId: string, page: number = 1, limit: number = 10) {
    try {
      this.logger.debug(`Fetching notifications for user ${userId}, page ${page}, limit ${limit}`);
      
      const skip = (page - 1) * limit;
      
      const [notifications, total] = await Promise.all([
        this.notificationModel
          .find({ recipients: userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('sender', 'name profileImg')
          .exec(),
        this.notificationModel.countDocuments({ recipients: userId }),
      ]);

      // Map the notifications to include only the read status for this user
      const mappedNotifications = notifications.map(notification => {
        const recipientIndex = notification.recipients.findIndex(r => r.toString() === userId);
        return {
          ...notification.toObject(),
          read: notification.read[recipientIndex],
        };
      });

      return {
        notifications: mappedNotifications,
        page,
        totalPages: Math.ceil(total / limit),
        total,
      };
    } catch (error) {
      this.logger.error(`Error fetching notifications: ${error.message}`);
      throw error;
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationDocument | null> {
    try {
      this.logger.debug(`Marking notification ${notificationId} as read for user ${userId}`);
      
      const notification = await this.notificationModel.findById(notificationId);
      if (!notification) {
        throw new NotFoundException(`Notification with id ${notificationId} not found`);
      }

      const recipientIndex = notification.recipients.findIndex(r => r.toString() === userId);
      if (recipientIndex === -1) {
        throw new NotFoundException(`User ${userId} is not a recipient of notification ${notificationId}`);
      }

      // Update only this recipient's read status
      notification.read[recipientIndex] = true;
      const updatedNotification = await notification.save();
      
      this.logger.debug('Notification marked as read:', updatedNotification);
      return updatedNotification;
    } catch (error) {
      this.logger.error(`Error marking notification as read: ${error.message}`);
      throw error;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      this.logger.debug(`Marking all notifications as read for user ${userId}`);
      
      const result = await this.notificationModel
        .updateMany(
          { recipients: userId, read: false },
          { $set: { read: true } }
        )
        .exec();
        
      if (!result.acknowledged) {
        this.logger.error('Failed to mark notifications as read');
        throw new Error('Failed to mark notifications as read');
      }
      
      this.logger.debug(`Marked ${result.modifiedCount} notifications as read`);
    } catch (error) {
      this.logger.error(`Error marking all notifications as read: ${error.message}`);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      this.logger.debug(`Deleting notification ${notificationId}`);
      
      const result = await this.notificationModel
        .findByIdAndDelete(notificationId)
        .exec();
        
      if (!result) {
        this.logger.warn(`Notification with id ${notificationId} not found`);
        throw new NotFoundException(`Notification with id ${notificationId} not found`);
      }
      
      this.logger.debug('Notification deleted successfully');
    } catch (error) {
      this.logger.error(`Error deleting notification: ${error.message}`);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      this.logger.debug(`Getting unread count for user ${userId}`);
      
      const notifications = await this.notificationModel.find({
        recipients: userId
      });

      // Count notifications where this user's read status is false
      const count = notifications.reduce((acc, notification) => {
        const recipientIndex = notification.recipients.findIndex(
          r => r.toString() === userId
        );
        if (recipientIndex === -1 || !notification.read[recipientIndex]) {
          return acc + 1;
        }
        return acc;
      }, 0);
      
      this.logger.debug(`Unread count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`Error getting unread count: ${error.message}`);
      throw error;
    }
  }
}