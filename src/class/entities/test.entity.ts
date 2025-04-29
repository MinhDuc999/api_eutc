import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ClassEntity } from './class.entity';
import { TestSubmissionEntity } from './test-submission.entity';

@Entity('tests')
export class TestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => ClassEntity, (cls) => cls.tests)
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @OneToMany(() => TestSubmissionEntity, (submission) => submission.test)
  submissions: TestSubmissionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
