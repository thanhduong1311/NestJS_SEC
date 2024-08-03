import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Classes } from './classes.entity';
import { Student } from './student.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'attendance' })
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Classes, classes => classes.attendance)
  classes: Classes;

  @ManyToOne(() => Student, student => student.attendance)
  student: Student;

  @Column()
  date: string;

  @Column()
  isAttended: boolean;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
