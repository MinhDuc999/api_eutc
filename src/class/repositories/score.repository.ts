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
          continue; // Skip if student not found
        }

        scoreEntity = new ScoreEntity();
        scoreEntity.class = classEntity;
        scoreEntity.student = student;
      }

      // Update score values
      scoreEntity.qt = studentScore.qt ?? 0;
      scoreEntity.th = studentScore.th ?? 0;

      // Calculate tk (average) and tt (status)
      if (studentScore.qt !== undefined && studentScore.th !== undefined) {
        scoreEntity.tk = Number(
          ((studentScore.qt + studentScore.th) / 2).toFixed(1),
        );
        scoreEntity.tt = scoreEntity.tk >= 5 ? 'Đạt' : 'Không đạt';
      }

      const savedScore = await this.save(scoreEntity);
      scores.push(savedScore);
    }

    return scores;
  }
}
