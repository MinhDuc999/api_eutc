import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountRepository } from '../accounts/repositories/account.repository';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './entities/jwt-payload.interface';
import { ResponseData } from '../common/global';

@Injectable()
export class AuthService {
  constructor(
    private accountRepository: AccountRepository,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ResponseData<any>> {
    try {
      // Find user by email
      const account = await this.accountRepository.findOne({
        where: { email: loginDto.email },
      });

      // Check if user exists
      if (!account) {
        throw new UnauthorizedException('Email không tồn tại');
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        account.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Mật khẩu không chính xác');
      }

      // Generate JWT token
      const payload: JwtPayload = {
        sub: account.codeID,
        email: account.email,
        accountType: account.accountType,
      };

      const token = this.jwtService.sign(payload);

      // Return user info and token
      return {
        statusCode: 200,
        message: 'Đăng nhập thành công',
        error: null,
        data: {
          user: {
            codeID: account.codeID,
            email: account.email,
            fullName: account.fullName,
            accountType: account.accountType,
            imageUrl: account.imageUrl,
          },
          token,
        },
      };
    } catch (error) {
      return {
        statusCode: 401,
        message: 'Đăng nhập thất bại',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }
}
