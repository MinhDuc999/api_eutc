import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ nullable: true })
  fileUrl: string;
}
