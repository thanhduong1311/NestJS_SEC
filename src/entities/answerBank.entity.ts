import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { QuestionBank } from './questionBank.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'answerBank' })
export class AnswerBank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => QuestionBank, questionBank => questionBank.answerBank)
  question: QuestionBank;

  @Column()
  isCorrect: boolean;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
