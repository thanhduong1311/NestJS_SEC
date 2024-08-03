import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Admin' })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'mediumtext', nullable: true })
  avatar: string;

  @Column()
  status: string;

  @Column({ default: 'ENG' })
  language: string;

  @Column({ default: 'LIGHT' })
  theme: string;

  @Column({ nullable: true, type: 'mediumtext' })
  refreshToken: string;

  @ManyToOne(() => Role, role => role.admins)
  role: Role;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
