import { Injectable } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { ResponseData } from '../common/global';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<ResponseData<NotificationEntity>> {
    try {
      const notification = await this.notificationRepository.createNotification(
        createNotificationDto,
      );
      return {
        statusCode: 200,
        message: 'Notification created successfully',
        error: null,
        data: notification,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to create notification',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async getAllNotifications(): Promise<ResponseData<NotificationEntity[]>> {
    try {
      const notifications =
        await this.notificationRepository.getAllNotifications();
      return {
        statusCode: 200,
        message: 'Notifications retrieved successfully',
        error: null,
        data: notifications,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to retrieve notifications',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getNotificationById(
    id: number,
  ): Promise<ResponseData<NotificationEntity>> {
    try {
      const notification =
        await this.notificationRepository.getNotificationById(id);

      if (!notification) {
        return {
          statusCode: 404,
          message: 'Notification not found',
          error: 'No notification found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Notification retrieved successfully',
        error: null,
        data: notification,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving notification',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateNotification(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<ResponseData<NotificationEntity>> {
    try {
      const notification = await this.notificationRepository.updateNotification(
        id,
        updateNotificationDto,
      );

      if (!notification) {
        return {
          statusCode: 404,
          message: 'Notification not found',
          error: 'No notification found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Notification updated successfully',
        error: null,
        data: notification,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update notification',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async deleteNotification(id: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.notificationRepository.deleteNotification(id);

      if (!result) {
        return {
          statusCode: 404,
          message: 'Notification not found',
          error: 'No notification found with the given ID',
          data: false,
        };
      }

      return {
        statusCode: 200,
        message: 'Notification deleted successfully',
        error: null,
        data: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete notification',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
      };
    }
  }
}
