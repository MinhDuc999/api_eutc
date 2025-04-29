import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from './entities/class.entity';
import { ClassFileEntity } from './entities/class-file.entity';
import { TestEntity } from './entities/test.entity';
import { TestSubmissionEntity } from './entities/test-submission.entity';
import { ScoreEntity } from './entities/score.entity';
import { ClassController } from './class.controller';
import { TestController } from './test.controller';
import { ScoreController } from './score.controller';
import { ClassService } from './class.service';
import { TestService } from './test.service';
import { ScoreService } from './score.service';
import { ClassRepository } from './repositories/class.repository';
import { TestRepository } from './repositories/test.repository';
import { ScoreRepository } from './repositories/score.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassEntity,
      ClassFileEntity,
      TestEntity,
      TestSubmissionEntity,
      ScoreEntity,
    ]),
    AuthModule,
  ],
  controllers: [ClassController, TestController, ScoreController],
  providers: [
    ClassService,
    TestService,
    ScoreService,
    ClassRepository,
    TestRepository,
    ScoreRepository,
  ],
  exports: [ClassService, TestService, ScoreService],
})
export class ClassModule {}
