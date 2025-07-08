import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ScoreEntity } from '../entities/score.entity';
import { ClassScoreDto } from '../dto/score.dto';
import { ClassEntity } from '../entities/class.entity';
import { AccountEntity } from '../../accounts/entities/account.entity';

@Injectable()
export class ScoreRepository extends Repository<ScoreEntity> {
  constructor(private dataSource: DataSource) {
    super(ScoreEntity, dataSource.createEntityManager());
  }

  async getScoresByClassId(classId: number): Promise<ScoreEntity[]> {
    return await this.find({
      where: { class: { classId } },
      relations: ['student', 'class'],
    });
  }

  async saveClassScores(classScoreDto: ClassScoreDto): Promise<ScoreEntity[]> {
    const classRepository = this.dataSource.getRepository(ClassEntity);
    const classEntity = await classRepository.findOne({
      where: { classId: classScoreDto.classId },
    });

    if (!classEntity) {
      throw new Error('Class not found');
    }

    const accountRepository = this.dataSource.getRepository(AccountEntity);
    const scores: ScoreEntity[] = [];

    for (const studentScore of classScoreDto.score) {
      let scoreEntity = await this.findOne({
        where: {
          class: { classId: classScoreDto.classId },
          student: { codeID: studentScore.studentId },
        },
        relations: ['student', 'class'],
      });

      if (!scoreEntity) {
        // Create new score if it doesn't exist
        const student = await accountRepository.findOne({
          where: { codeID: studentScore.studentId },
        });

        if (!student) {
          continue;
        }

        scoreEntity = new ScoreEntity();
        scoreEntity.class = classEntity;
        scoreEntity.student = student;
      }

      if (studentScore.qt !== undefined) {
        scoreEntity.qt = studentScore.qt;
      }

      if (studentScore.th !== undefined) {
        scoreEntity.th = studentScore.th;
      }

      if (studentScore.tk !== undefined) {
        scoreEntity.tk = studentScore.tk;
      }

      if (studentScore.tt !== undefined) {
        scoreEntity.tt = studentScore.tt;
      }

      const savedScore = await this.save(scoreEntity);
      scores.push(savedScore);
    }

    return scores;
  }
}
