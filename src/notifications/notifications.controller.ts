import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountType } from '../accounts/dto/create-account.dto';

@Controller('notif')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async createNotification(
    @Body(ValidationPipe) createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  async getAllNotifications() {
    return this.notificationService.getAllNotifications();
  }

  @Get(':id')
  async getNotificationById(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.getNotificationById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateNotification(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.updateNotification(
      id,
      updateNotificationDto,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN)
  async deleteNotification(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.deleteNotification(id);
  }
}
