import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Classes } from './classes.entity';
import { Course } from './course.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'classSchedule' })
export class ClassSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, course => course.schedule)
  course: Course;

  @ManyToOne(() => Classes, classes => classes.schedule)
  classes: Classes;

  @Column()
  sectionDate: string;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
