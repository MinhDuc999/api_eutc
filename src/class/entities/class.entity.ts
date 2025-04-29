import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { TestEntity } from './test.entity';
import { ClassFileEntity } from './class-file.entity';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { AccountEntity } from 'src/accounts/entities/account.entity';

@Entity('classes')
export class ClassEntity {
  @PrimaryGeneratedColumn()
  classId: number;

  @Column()
  className: string;

  @ManyToOne(() => SubjectEntity)
  @JoinColumn({ name: 'subjectId' })
  subject: SubjectEntity;

  @Column({ type: 'date' })
  startDate: string;

  @Column()
  schedule: string;

  @Column()
  room: string;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'teacherId' })
  teacher: AccountEntity;

  @ManyToMany(() => AccountEntity)
  @JoinTable({
    name: 'class_students',
    joinColumn: { name: 'classId', referencedColumnName: 'classId' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'codeID' },
  })
  students: AccountEntity[];

  @OneToMany(() => ClassFileEntity, (file) => file.class)
  files: ClassFileEntity[];

  @OneToMany(() => TestEntity, (test) => test.class)
  tests: TestEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
