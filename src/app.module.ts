import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsModule } from './uploads/uploads.module';
import { UpfilesModule } from './upfiles/files.module';
import { SubjectModule } from './subjects/subject.module';
import { NotificationModule } from './notifications/notifications.module';
import { AccountModule } from './accounts/account.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        timezone: '+07:00',
      }),
      inject: [ConfigService],
    }),
    NotificationModule,
    UploadsModule,
    UpfilesModule,
    SubjectModule,
    AccountModule,
    AuthModule,
    ClassModule,
  ],
})
export class AppModule {}
