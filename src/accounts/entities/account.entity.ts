import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryColumn()
  codeID: string;

  @Column()
  fullName: string;

  @Column()
  gender: string;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column()
  hometown: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  accountType: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
