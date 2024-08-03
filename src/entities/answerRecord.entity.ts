import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Student } from './student.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'answerRecord' })
export class AnswerRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, student => student.answerRecord)
  student: Student;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ type: 'longtext' })
  record: string;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
