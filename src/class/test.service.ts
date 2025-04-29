import { Injectable } from '@nestjs/common';
import { TestRepository } from './repositories/test.repository';
import { TestDto } from './dto/test.dto';
import { TestEntity } from './entities/test.entity';
import { ResponseData } from '../common/global';
import { TestSubmissionEntity } from './entities/test-submission.entity';

@Injectable()
export class TestService {
  constructor(private readonly testRepository: TestRepository) {}

  async createTest(
    classId: number,
    testDto: TestDto,
  ): Promise<ResponseData<TestEntity>> {
    try {
      const test = await this.testRepository.createTest(classId, testDto);
      return {
        statusCode: 200,
        message: 'Test created successfully',
        error: null,
        data: test,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to create test',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async getTestsByClassId(
    classId: number,
  ): Promise<ResponseData<TestEntity[]>> {
    try {
      const tests = await this.testRepository.getTestsByClassId(classId);
      return {
        statusCode: 200,
        message: 'Tests retrieved successfully',
        error: null,
        data: tests,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to retrieve tests',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getTestById(testId: number): Promise<ResponseData<TestEntity>> {
    try {
      const test = await this.testRepository.getTestById(testId);

      if (!test) {
        return {
          statusCode: 404,
          message: 'Test not found',
          error: 'No test found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Test retrieved successfully',
        error: null,
        data: test,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving test',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateTest(
    testId: number,
    testDto: TestDto,
  ): Promise<ResponseData<TestEntity>> {
    try {
      const test = await this.testRepository.updateTest(testId, testDto);

      if (!test) {
        return {
          statusCode: 404,
          message: 'Test not found',
          error: 'No test found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Test updated successfully',
        error: null,
        data: test,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update test',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async deleteTest(testId: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.testRepository.deleteTest(testId);

      if (!result) {
        return {
          statusCode: 404,
          message: 'Test not found',
          error: 'No test found with the given ID',
          data: false,
        };
      }

      return {
        statusCode: 200,
        message: 'Test deleted successfully',
        error: null,
        data: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete test',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
      };
    }
  }

  async addSubmission(
    testId: number,
    studentCode: string,
    fileUrl: string,
  ): Promise<ResponseData<TestSubmissionEntity>> {
    try {
      const submission = await this.testRepository.addSubmission(
        testId,
        studentCode,
        fileUrl,
      );

      return {
        statusCode: 200,
        message: 'Submission added successfully',
        error: null,
        data: submission,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to add submission',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async getAllSubmissions(
    testId: number,
  ): Promise<ResponseData<TestSubmissionEntity[]>> {
    try {
      const submissions =
        await this.testRepository.getAllSubmissionsByTestId(testId);
      return {
        statusCode: 200,
        message: 'Get all submissions successfully',
        error: null,
        data: submissions,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get submissions',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getSubmission(
    submissionId: number,
  ): Promise<ResponseData<TestSubmissionEntity>> {
    try {
      const submission =
        await this.testRepository.getSubmissionById(submissionId);
      if (!submission) {
        return {
          statusCode: 404,
          message: 'Submission not found',
          error: 'No submission with given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Get submission successfully',
        error: null,
        data: submission,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get submission',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateSubmission(
    submissionId: number,
    fileUrl: string,
  ): Promise<ResponseData<TestSubmissionEntity>> {
    try {
      const submission = await this.testRepository.updateSubmission(
        submissionId,
        fileUrl,
      );
      if (!submission) {
        return {
          statusCode: 404,
          message: 'Submission not found',
          error: 'No submission with given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Submission updated successfully',
        error: null,
        data: submission,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update submission',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async deleteSubmission(submissionId: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.testRepository.deleteSubmission(submissionId);
      if (!result) {
        return {
          statusCode: 404,
          message: 'Submission not found',
          error: 'No submission with given ID',
          data: false,
        };
      }

      return {
        statusCode: 200,
        message: 'Submission deleted successfully',
        error: null,
        data: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete submission',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
      };
    }
  }
}
