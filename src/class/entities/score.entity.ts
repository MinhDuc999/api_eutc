import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClassEntity } from './class.entity';
import { AccountEntity } from 'src/accounts/entities/account.entity';

@Entity('scores')
export class ScoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ClassEntity)
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'studentId' })
  student: AccountEntity;

  @Column({ type: 'float', nullable: true })
  qt: number;

  @Column({ type: 'float', nullable: true })
  th: number;

  @Column({ type: 'float', nullable: true })
  tk: number;

  @Column({ nullable: true })
  tt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
