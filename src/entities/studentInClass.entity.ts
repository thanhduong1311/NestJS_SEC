import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from './student.entity';
import { Classes } from './classes.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'studentInClass' })
export class StudentInClass {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, student => student.studentInClass)
  student: Student;

  @ManyToOne(() => Classes, classes => classes.studentInClass)
  classes: Classes;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
