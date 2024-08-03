import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { Attendance } from './atttendance.entity';
import { StudentInClass } from './studentInClass.entity';
import { AnswerRecord } from './answerRecord.entity';
import { formatDate } from 'src/utils/dateFormat';
import { CourseResult } from './courseResult.entity';

@Entity({ name: 'student' })
export class Student {
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

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'mediumtext', nullable: true })
  avatar: string;

  @Column({ nullable: true })
  dob: string;

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

  @OneToMany(() => Attendance, attendance => attendance.student)
  attendance: Attendance[];

  @OneToMany(() => CourseResult, courseResult => courseResult.student)
  courseResult: CourseResult[];

  @OneToMany(() => StudentInClass, studentInClass => studentInClass.student)
  studentInClass: StudentInClass[];

  @OneToMany(() => AnswerRecord, answerRecord => answerRecord.student)
  answerRecord: AnswerRecord[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
