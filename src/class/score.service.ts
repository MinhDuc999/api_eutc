import { Injectable } from '@nestjs/common';
import { ScoreRepository } from './repositories/score.repository';
import { ClassScoreDto } from './dto/score.dto';
import { ResponseData } from '../common/global';

@Injectable()
export class ScoreService {
  constructor(private readonly scoreRepository: ScoreRepository) {}

  async getScoresByClassId(
    classId: number,
  ): Promise<ResponseData<ClassScoreDto>> {
    try {
      const scores = await this.scoreRepository.getScoresByClassId(classId);

      if (!scores.length) {
        return {
          statusCode: 404,
          message: 'No scores found for this class',
          error: null,
          data: null,
        };
      }

      // Transform to the required format
      const classScore: ClassScoreDto = {
        classId: classId,
        className: scores[0].class.className,
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
        message: 'Scores retrieved successfully',
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

      // Transform back to the required format
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
