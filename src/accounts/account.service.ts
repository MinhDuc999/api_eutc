import { Injectable } from '@nestjs/common';
import { AccountRepository } from './repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AccountEntity } from './entities/account.entity';
import { ResponseData } from '../common/global';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(
    createAccountDto: CreateAccountDto,
  ): Promise<ResponseData<AccountEntity>> {
    try {
      const existingAccount = await this.accountRepository.findByEmail(
        createAccountDto.email,
      );
      if (existingAccount) {
        return {
          statusCode: 409,
          message: 'Email đã tồn tại',
          error: 'Duplicate email',
          data: [],
        };
      }

      const account =
        await this.accountRepository.createAccount(createAccountDto);
      return {
        statusCode: 200,
        message: 'Account created successfully',
        error: null,
        data: [account],
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Failed to create account',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getAllAccounts(): Promise<ResponseData<AccountEntity[]>> {
    try {
      const accounts = await this.accountRepository.getAllAccounts();
      // Don't return passwords in response
      const accountsWithoutPasswords = accounts.map((account) => {
        //const { password, ...accountData } = account;
        return account;
      });

      return {
        statusCode: 200,
        message: 'Accounts retrieved successfully',
        error: null,
        data: accountsWithoutPasswords,
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Failed to retrieve accounts',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getAccountByCodeID(
    codeID: string,
  ): Promise<ResponseData<AccountEntity>> {
    try {
      const account = await this.accountRepository.getAccountByCodeID(codeID);

      if (!account) {
        return {
          statusCode: 404,
          message: 'Account not found',
          error: 'No account found with the given codeID',
          data: [],
        };
      }

      // Don't return password in response
      //const { password, ...accountData } = account;
      return {
        statusCode: 200,
        message: 'Account retrieved successfully',
        error: null,
        data: [account],
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving account',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async updateAccount(
    codeID: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<ResponseData<AccountEntity>> {
    try {
      const account = await this.accountRepository.updateAccount(
        codeID,
        updateAccountDto,
      );

      if (!account) {
        return {
          statusCode: 404,
          message: 'Account not found',
          error: 'No account found with the given codeID',
          data: [],
        };
      }

      // Don't return password in response
      //const { password, ...accountData } = account;
      return {
        statusCode: 200,
        message: 'Account updated successfully',
        error: null,
        data: [account],
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update account',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async deleteAccount(codeID: string): Promise<ResponseData<boolean>> {
    try {
      const result = await this.accountRepository.deleteAccount(codeID);

      if (!result) {
        return {
          statusCode: 404,
          message: 'Account not found',
          error: 'No account found with the given codeID',
          data: [false],
        };
      }

      return {
        statusCode: 200,
        message: 'Account deleted successfully',
        error: null,
        data: [true],
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete account',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [false],
      };
    }
  }

  async changePassword(
    codeID: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseData<boolean>> {
    try {
      const result = await this.accountRepository.changePassword(
        codeID,
        changePasswordDto,
      );

      if (!result) {
        return {
          statusCode: 404,
          message: 'Account not found',
          error: 'No account found with the given codeID',
          data: [false],
        };
      }

      return {
        statusCode: 200,
        message: 'Password changed successfully',
        error: null,
        data: [true],
      };
    } catch (error) {
      return {
        statusCode: 400,
        message: 'Failed to change password',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [false],
      };
    }
  }
}
