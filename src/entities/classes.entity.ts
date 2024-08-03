import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Course } from './course.entity';
import { ClassSchedule } from './classSchedule.entity';
import { Attendance } from './atttendance.entity';
import { StudentInClass } from './studentInClass.entity';
import { TestSchedule } from './testSchedule.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'classes' })
export class Classes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  className: string;

  @ManyToOne(() => Teacher, teacher => teacher.classes)
  teacher: Teacher;

  @ManyToOne(() => Course, course => course.classes)
  course: Course;

  @Column()
  enrollerCount: number;

  @Column()
  createBy: string;

  @Column()
  updateBy: string;

  @OneToMany(() => ClassSchedule, classSchedule => classSchedule.classes)
  schedule: ClassSchedule[];

  @OneToMany(() => Attendance, attendance => attendance.classes)
  attendance: Attendance[];

  @OneToMany(() => StudentInClass, studentInClass => studentInClass.classes)
  studentInClass: StudentInClass[];

  @OneToMany(() => TestSchedule, testSchedule => testSchedule.class)
  testSchedule: TestSchedule[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
