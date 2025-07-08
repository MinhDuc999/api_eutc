import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TestEntity } from '../entities/test.entity';
import { TestDto } from '../dto/test.dto';
import { ClassEntity } from '../entities/class.entity';
import { TestSubmissionEntity } from '../entities/test-submission.entity';
import { AccountEntity } from '../../accounts/entities/account.entity';

@Injectable()
export class TestRepository extends Repository<TestEntity> {
  constructor(private dataSource: DataSource) {
    super(TestEntity, dataSource.createEntityManager());
  }

  async createTest(classId: number, testDto: TestDto): Promise<TestEntity> {
    const classRepository = this.dataSource.getRepository(ClassEntity);
    const classEntity = await classRepository.findOne({
      where: { classId },
    });

    if (!classEntity) {
      throw new Error('Class not found');
    }

    const test = new TestEntity();
    test.title = testDto.title || '';
    test.description = testDto.description || '';
    test.dueDate = new Date(testDto.dueDate || '');
    test.class = classEntity;

    if (testDto.files) {
      test.fileName = testDto.files.name || '';
      test.fileUrl = testDto.files.url || '';
    }

    return await this.save(test);
  }

  async getTestsByClassId(classId: number): Promise<TestEntity[]> {
    return await this.find({
      where: { class: { classId } },
      relations: ['submissions', 'submissions.student'],
    });
  }

  async getTestById(testId: number): Promise<TestEntity | null> {
    return await this.findOne({
      where: { id: testId },
      relations: ['submissions', 'submissions.student', 'class'],
    });
  }

  async updateTest(
    testId: number,
    testDto: TestDto,
  ): Promise<TestEntity | null> {
    const test = await this.findOne({
      where: { id: testId },
      relations: ['submissions', 'class'],
    });

    if (!test) {
      return null;
    }

    if (testDto.title) {
      test.title = testDto.title;
    }

    if (testDto.description) {
      test.description = testDto.description;
    }

    if (testDto.dueDate) {
      test.dueDate = new Date(testDto.dueDate);
    }

    if (testDto.files) {
      test.fileName = testDto.files.name || '';
      test.fileUrl = testDto.files.url || '';
    }

    return await this.save(test);
  }

  async deleteTest(testId: number): Promise<boolean> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from('test_submissions')
      .where('testId = :testId', { testId })
      .execute();

    const result = await this.delete(testId);
    return result.affected ? result.affected > 0 : false;
  }

  async getAllSubmissionsByTestId(
    testId: number,
  ): Promise<TestSubmissionEntity[]> {
    const submissionRepository =
      this.dataSource.getRepository(TestSubmissionEntity);
    return await submissionRepository.find({
      where: { test: { id: testId } },
      relations: ['student', 'test'],
    });
  }

  async getSubmissionById(
    submissionId: number,
  ): Promise<TestSubmissionEntity | null> {
    const submissionRepository =
      this.dataSource.getRepository(TestSubmissionEntity);
    return await submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['student', 'test'],
    });
  }

  async addSubmission(
    testId: number,
    studentCode: string,
    fileUrl: string,
  ): Promise<TestSubmissionEntity> {
    const test = await this.findOne({
      where: { id: testId },
    });

    if (!test) {
      throw new Error('Test not found');
    }

    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const student = await accountRepository.findOne({
      where: { codeID: studentCode },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const submissionRepository =
      this.dataSource.getRepository(TestSubmissionEntity);
    const submission = new TestSubmissionEntity();
    submission.student = student;
    submission.fileUrl = fileUrl;
    submission.test = test;

    return await submissionRepository.save(submission);
  }
  async updateSubmission(
    submissionId: number,
    fileUrl: string,
  ): Promise<TestSubmissionEntity | null> {
    const submissionRepository =
      this.dataSource.getRepository(TestSubmissionEntity);
    const submission = await submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['student', 'test'],
    });

    if (!submission) {
      return null;
    }

    submission.fileUrl = fileUrl;
    return await submissionRepository.save(submission);
  }

  async deleteSubmission(submissionId: number): Promise<boolean> {
    const submissionRepository =
      this.dataSource.getRepository(TestSubmissionEntity);
    const result = await submissionRepository.delete(submissionId);
    return result.affected ? result.affected > 0 : false;
  }
}
