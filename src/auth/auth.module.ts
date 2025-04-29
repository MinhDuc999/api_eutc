import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AccountModule } from '../accounts/account.module';
import { AccountRepository } from '../accounts/repositories/account.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your_jwt_secret_key',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AccountRepository],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
