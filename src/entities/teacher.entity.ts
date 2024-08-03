import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Classes } from './classes.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'teacher' })
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'mediumtext', nullable: true })
  avatar: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ default: 'ENG' })
  language: string;

  @Column({ default: 'LIGHT' })
  theme: string;

  @Column({ nullable: true, type: 'mediumtext' })
  refreshToken: string;

  @ManyToOne(() => Role, role => role.admins)
  role: Role;

  @OneToMany(() => Classes, classes => classes.teacher)
  classes: Classes[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
