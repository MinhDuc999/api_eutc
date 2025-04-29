import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subjects')
export class SubjectEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subjectName: string;

  @Column()
  subjectCategory: string;

  @Column()
  numberCredit: number;

  @Column()
  description: string;

  @Column()
  totalNumber: number;
}
