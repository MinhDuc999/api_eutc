import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TestEntity } from './test.entity';
import { AccountEntity } from 'src/accounts/entities/account.entity';

@Entity('test_submissions')
export class TestSubmissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'studentId' })
  student: AccountEntity;

  @Column()
  fileUrl: string;

  @CreateDateColumn()
  submittedAt: Date;

  @ManyToOne(() => TestEntity, (test) => test.submissions)
  @JoinColumn({ name: 'testId' })
  test: TestEntity;
}
