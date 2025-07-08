import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TestEntity } from './test.entity';
import { AccountEntity } from 'src/accounts/entities/account.entity';

@Entity('test_submissions')
export class SubmissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  testId: number;

  @Column()
  studentId: string;

  @Column()
  fileUrl: string;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => TestEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'testId' })
  test: TestEntity;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'studentId', referencedColumnName: 'codeID' })
  student: AccountEntity;
}
