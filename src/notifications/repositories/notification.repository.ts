import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { NotificationEntity } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';

@Injectable()
export class NotificationRepository extends Repository<NotificationEntity> {
  constructor(private dataSource: DataSource) {
    super(NotificationEntity, dataSource.createEntityManager());
  }

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = this.create(createNotificationDto);
    return await this.save(notification);
  }

  async getAllNotifications(): Promise<NotificationEntity[]> {
    return (await this.find()) || [];
  }

  async getNotificationById(id: number): Promise<NotificationEntity | null> {
    return await this.findOne({
      where: { id },
    });
  }

  async updateNotification(
    id: number,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationEntity | null> {
    const notification = await this.findOne({ where: { id } });
    if (!notification) {
      return null;
    }

    const updatedNotification = { ...notification, ...updateNotificationDto };
    return await this.save(updatedNotification);
  }

  async deleteNotification(id: number): Promise<boolean> {
    const notification = await this.findOne({ where: { id } });
    if (!notification) {
      return false;
    }

    await this.remove(notification);
    return true;
  }
}
