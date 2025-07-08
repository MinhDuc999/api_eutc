import { Injectable } from '@nestjs/common';
import { ScoreRepository } from './repositories/score.repository';
import { ClassScoreDto } from './dto/score.dto';
import { ResponseData } from '../common/global';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassEntity } from './entities/class.entity';

@Injectable()
export class ScoreService {
  constructor(
    private readonly scoreRepository: ScoreRepository,
    @InjectRepository(ClassEntity)
    private readonly classRepository: Repository<ClassEntity>,
  ) {}

  async getScoresByClassId(
    classId: number,
  ): Promise<ResponseData<ClassScoreDto>> {
    try {
      const classEntity = await this.classRepository.findOne({
        where: { classId },
      });

      if (!classEntity) {
        return {
          statusCode: 404,
          message: 'Class not found',
          error: null,
          data: null,
        };
      }

      const scores = await this.scoreRepository.getScoresByClassId(classId);

      const classScore: ClassScoreDto = {
        classId: classId,
        className: classEntity.className,
        score: scores.map((score) => ({
          studentId: score.student.codeID,
          fullName: score.student.fullName,
          email: score.student.email,
          qt: score.qt,
          th: score.th,
          tk: score.tk,
          tt: score.tt,
          updatedAt: score.updatedAt,
        })),
      };

      return {
        statusCode: 200,
        message: scores.length
          ? 'Scores retrieved successfully'
          : 'No scores found for this class yet',
        error: null,
        data: classScore,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to retrieve scores',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async saveClassScores(
    classScoreDto: ClassScoreDto,
  ): Promise<ResponseData<ClassScoreDto>> {
    try {
      const scores = await this.scoreRepository.saveClassScores(classScoreDto);

      const updatedClassScore: ClassScoreDto = {
        classId: classScoreDto.classId,
        className: classScoreDto.className,
        score: scores.map((score) => ({
          studentId: score.student.codeID,
          fullName: score.student.fullName,
          email: score.student.email,
          qt: score.qt,
          th: score.th,
          tk: score.tk,
          tt: score.tt,
          updatedAt: score.updatedAt,
        })),
      };

      return {
        statusCode: 200,
        message: 'Scores saved successfully',
        error: null,
        data: updatedClassScore,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to save scores',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }
}
