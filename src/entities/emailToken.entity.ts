import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'emailToken' })
export class EmailToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'mediumtext' })
  token: string;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column()
  expiresAt: string;
}
