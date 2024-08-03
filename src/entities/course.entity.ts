import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Classes } from './classes.entity';
import { ClassSchedule } from './classSchedule.entity';
import { formatDate } from 'src/utils/dateFormat';
import { CourseResult } from './courseResult.entity';

@Entity({ name: 'course' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courseName: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column()
  numberOfLesson: number;

  @OneToMany(() => Classes, classes => classes.course)
  classes: Classes[];

  @OneToMany(() => ClassSchedule, classSchedule => classSchedule.course)
  schedule: ClassSchedule[];

  @OneToMany(() => CourseResult, courseResult => courseResult.student)
  courseResult: CourseResult[];

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  createBy: string;

  @Column()
  updateBy: string;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
