import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { formatDate } from 'src/utils/dateFormat';
import { Student } from './student.entity';
import { Course } from './course.entity';

@Entity({ name: 'courseResult' })
export class CourseResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, course => course.courseResult)
  course: Course;

  @ManyToOne(() => Student, student => student.courseResult)
  student: Student;

  @Column()
  result: boolean;

  @Column()
  mark: number;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
