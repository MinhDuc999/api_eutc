import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClassEntity } from './class.entity';

@Entity('class_files')
export class ClassFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => ClassEntity, (cls) => cls.files)
  @JoinColumn({ name: 'classId' })
  class: ClassEntity;
}
