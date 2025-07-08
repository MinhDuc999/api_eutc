import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { TestService } from './test.service';
import { TestDto } from './dto/test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AccountType } from '../accounts/dto/create-account.dto';

@Controller('classes/:classId/tests')
@UseGuards(JwtAuthGuard)
export class TestController {
  constructor(private testService: TestService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async createTest(
    @Param('classId', ParseIntPipe) classId: number,
    @Body() testDto: TestDto,
  ) {
    return this.testService.createTest(classId, testDto);
  }

  @Get()
  async getTestsByClassId(@Param('classId', ParseIntPipe) classId: number) {
    return this.testService.getTestsByClassId(classId);
  }

  @Get(':testId')
  async getTestById(@Param('testId', ParseIntPipe) testId: number) {
    return this.testService.getTestById(testId);
  }

  @Put(':testId')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateTest(
    @Param('testId', ParseIntPipe) testId: number,
    @Body() testDto: TestDto,
  ) {
    return this.testService.updateTest(testId, testDto);
  }

  @Delete(':testId')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async deleteTest(@Param('testId', ParseIntPipe) testId: number) {
    return this.testService.deleteTest(testId);
  }

  @Get(':testId/submissions')
  async getAllSubmissions(@Param('testId', ParseIntPipe) testId: number) {
    return this.testService.getAllSubmissions(testId);
  }

  @Get(':testId/submissions/:submissionId')
  async getSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ) {
    return this.testService.getSubmission(submissionId);
  }

  @Post(':testId/submissions')
  async addSubmission(
    @Param('testId', ParseIntPipe) testId: number,
    @Body() submission: { studentCode: string; fileUrl: string },
  ) {
    return this.testService.addSubmission(
      testId,
      submission.studentCode,
      submission.fileUrl,
    );
  }

  @Put(':testId/submissions/:submissionId')
  async updateSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() body: { fileUrl: string },
  ) {
    return this.testService.updateSubmission(submissionId, body.fileUrl);
  }

  @Delete(':testId/submissions/:submissionId')
  async deleteSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ) {
    return this.testService.deleteSubmission(submissionId);
  }
}
