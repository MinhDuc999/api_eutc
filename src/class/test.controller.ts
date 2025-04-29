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

  // Only Admin and Teacher can create tests
  @Post()
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async createTest(
    @Param('classId', ParseIntPipe) classId: number,
    @Body() testDto: TestDto,
  ) {
    return this.testService.createTest(classId, testDto);
  }

  // All authenticated users can view tests
  @Get()
  async getTestsByClassId(@Param('classId', ParseIntPipe) classId: number) {
    return this.testService.getTestsByClassId(classId);
  }

  // All authenticated users can view test details
  @Get(':testId')
  async getTestById(@Param('testId', ParseIntPipe) testId: number) {
    return this.testService.getTestById(testId);
  }

  // Only Admin and Teacher can update tests
  @Put(':testId')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async updateTest(
    @Param('testId', ParseIntPipe) testId: number,
    @Body() testDto: TestDto,
  ) {
    return this.testService.updateTest(testId, testDto);
  }

  // Only Admin and Teacher can delete tests
  @Delete(':testId')
  @UseGuards(RolesGuard)
  @Roles(AccountType.ADMIN, AccountType.TEACHER)
  async deleteTest(@Param('testId', ParseIntPipe) testId: number) {
    return this.testService.deleteTest(testId);
  }

  // Lấy tất cả submissions của một bài kiểm tra
  @Get(':testId/submissions')
  async getAllSubmissions(@Param('testId', ParseIntPipe) testId: number) {
    return this.testService.getAllSubmissions(testId);
  }

  // Lấy một bài submission cụ thể
  @Get(':testId/submissions/:submissionId')
  async getSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ) {
    return this.testService.getSubmission(submissionId);
  }

  // Students can submit assignments
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
  // Cập nhật bài nộp
  @Put(':testId/submissions/:submissionId')
  async updateSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
    @Body() body: { fileUrl: string },
  ) {
    return this.testService.updateSubmission(submissionId, body.fileUrl);
  }

  // Xóa bài nộp
  @Delete(':testId/submissions/:submissionId')
  async deleteSubmission(
    @Param('submissionId', ParseIntPipe) submissionId: number,
  ) {
    return this.testService.deleteSubmission(submissionId);
  }
}
