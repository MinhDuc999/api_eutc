import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../entities/account.entity';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AccountRepository extends Repository<AccountEntity> {
  constructor(private dataSource: DataSource) {
    super(AccountEntity, dataSource.createEntityManager());
  }

  async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity> {
    // Check if passwords match
    if (createAccountDto.password !== createAccountDto.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createAccountDto.password, salt);

    const account = this.create({
      ...createAccountDto,
      password: hashedPassword,
    });

    return await this.save(account);
  }

  async getAllAccounts(): Promise<AccountEntity[]> {
    return (await this.find()) || [];
  }

  async getAccountByCodeID(codeID: string): Promise<AccountEntity | null> {
    return await this.findOne({
      where: { codeID },
    });
  }

  async updateAccount(
    codeID: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<AccountEntity | null> {
    const account = await this.findOne({ where: { codeID } });
    if (!account) {
      return null;
    }

    const updatedAccount = { ...account, ...updateAccountDto };
    return await this.save(updatedAccount);
  }

  async deleteAccount(codeID: string): Promise<boolean> {
    const account = await this.findOne({ where: { codeID } });
    if (!account) return false;

    await this.dataSource
      .createQueryBuilder()
      .update('classes')
      .set({ teacher: null })
      .where('teacherId = :codeID', { codeID })
      .execute();

    await this.remove(account);
    return true;
  }

  async changePassword(
    codeID: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const account = await this.findOne({ where: { codeID } });
    if (!account) {
      return false;
    }

    // Validate current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.password,
      account.password,
    );

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Check if new passwords match
    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new Error('New passwords do not match');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );

    // Update password
    account.password = hashedPassword;
    await this.save(account);
    return true;
  }

  async findByEmail(email: string): Promise<AccountEntity | null> {
    return await this.findOne({ where: { email } });
  }

  async resetPassword(
    codeID: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<boolean> {
    const account = await this.findOne({ where: { codeID } });
    if (!account) {
      return false;
    }

    // Check if new passwords match
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
      throw new Error('New passwords do not match');
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.newPassword,
      salt,
    );

    // Update password
    account.password = hashedPassword;
    await this.save(account);
    return true;
  }
}
