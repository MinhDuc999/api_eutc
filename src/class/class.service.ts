import { Injectable } from '@nestjs/common';
import { ClassRepository } from './repositories/class.repository';
import { ClassDto } from './dto/class.dto';
import { ClassEntity } from './entities/class.entity';
import { ResponseData } from '../common/global';

@Injectable()
export class ClassService {
  constructor(private readonly classRepository: ClassRepository) {}

  async createClass(classDto: ClassDto): Promise<ResponseData<ClassEntity>> {
    try {
      const classEntity = await this.classRepository.createClass(classDto);
      return {
        statusCode: 200,
        message: 'Class created successfully',
        error: null,
        data: classEntity,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to create class',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async getAllClasses(): Promise<ResponseData<ClassEntity[]>> {
    try {
      const classes = await this.classRepository.getAllClasses();
      return {
        statusCode: 200,
        message: 'Classes retrieved successfully',
        error: null,
        data: classes,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to retrieve classes',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getClassById(classId: number): Promise<ResponseData<ClassEntity>> {
    try {
      const classEntity = await this.classRepository.getClassById(classId);

      if (!classEntity) {
        return {
          statusCode: 404,
          message: 'Class not found',
          error: 'No class found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Class retrieved successfully',
        error: null,
        data: classEntity,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving class',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateClass(
    classId: number,
    classDto: ClassDto,
  ): Promise<ResponseData<ClassEntity>> {
    try {
      const classEntity = await this.classRepository.updateClass(
        classId,
        classDto,
      );

      if (!classEntity) {
        return {
          statusCode: 404,
          message: 'Class not found',
          error: 'No class found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Class updated successfully',
        error: null,
        data: classEntity,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update class',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async deleteClass(classId: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.classRepository.deleteClass(classId);

      if (!result) {
        return {
          statusCode: 404,
          message: 'Class not found',
          error: 'No class found with the given ID',
          data: false,
        };
      }

      return {
        statusCode: 200,
        message: 'Class deleted successfully',
        error: null,
        data: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete class',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
      };
    }
  }
}
