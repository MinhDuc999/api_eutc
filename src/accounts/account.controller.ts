import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountType } from './dto/create-account.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body(ValidationPipe) createAccountDto: CreateAccountDto,
  ) {
    return this.accountService.createAccount(createAccountDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllAccounts() {
    return this.accountService.getAllAccounts();
  }

  @Get(':codeID')
  @UseGuards(JwtAuthGuard)
  async getAccountByCodeID(@Param('codeID') codeID: string) {
    return this.accountService.getAccountByCodeID(codeID);
  }

  @Put(':codeID')
  @UseGuards(JwtAuthGuard)
  async updateAccount(
    @Param('codeID') codeID: string,
    @Body(ValidationPipe) updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.updateAccount(codeID, updateAccountDto);
  }

  @Delete(':codeID')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountType.ADMIN)
  async deleteAccount(@Param('codeID') codeID: string) {
    return this.accountService.deleteAccount(codeID);
  }

  @Post(':codeID/changePass')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Param('codeID') codeID: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ) {
    return this.accountService.changePassword(codeID, changePasswordDto);
  }

  @Post(':codeID/resetPassword')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountType.ADMIN)
  async resetPassword(
    @Param('codeID') codeID: string,
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ) {
    return this.accountService.resetPassword(codeID, resetPasswordDto);
  }
}
