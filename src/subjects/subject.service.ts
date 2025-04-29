import { Injectable } from '@nestjs/common';
import { SubjectRepository } from './repositories/subject.repository';
import { SubjectDto } from './dto/subject.dto';
import { SubjectEntity } from './entities/subject.entity';
import { ResponseData } from '../common/global';

@Injectable()
export class SubjectService {
  constructor(private readonly subjectRepository: SubjectRepository) {}

  async createSubject(
    subjectDto: SubjectDto,
  ): Promise<ResponseData<SubjectEntity>> {
    try {
      const subject = await this.subjectRepository.createSubject(subjectDto);
      return {
        statusCode: 200,
        message: 'Subject created successfully',
        error: null,
        data: subject,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to create subject',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async getAllSubjects(): Promise<ResponseData<SubjectEntity[]>> {
    try {
      const subjects = await this.subjectRepository.getAllSubjects();
      return {
        statusCode: 200,
        message: 'Subjects retrieved successfully',
        error: null,
        data: subjects,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to retrieve subjects',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getSubjectById(id: number): Promise<ResponseData<SubjectEntity>> {
    try {
      const subject = await this.subjectRepository.getSubjectById(id);

      if (!subject) {
        return {
          statusCode: 404,
          message: 'Subject not found',
          error: 'No subject found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Subject retrieved successfully',
        error: null,
        data: subject,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving subject',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateSubject(
    id: number,
    subjectDto: SubjectDto,
  ): Promise<ResponseData<SubjectEntity>> {
    try {
      const subject = await this.subjectRepository.updateSubject(
        id,
        subjectDto,
      );

      if (!subject) {
        return {
          statusCode: 404,
          message: 'Subject not found',
          error: 'No subject found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Subject updated successfully',
        error: null,
        data: subject,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update subject',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async deleteSubject(id: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.subjectRepository.deleteSubject(id);

      if (!result) {
        return {
          statusCode: 404,
          message: 'Subject not found',
          error: 'No subject found with the given ID',
          data: false,
        };
      }

      return {
        statusCode: 200,
        message: 'Subject deleted successfully',
        error: null,
        data: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete subject',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
      };
    }
  }
}
