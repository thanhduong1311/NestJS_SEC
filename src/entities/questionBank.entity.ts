import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { QuestionType } from './questionType.entity';
import { AnswerBank } from './answerBank.entity';
import { TestQuestion } from './testQuestion.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'questionBank' })
export class QuestionBank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext' })
  content: string;

  @ManyToOne(() => QuestionType, questionType => questionType.questionBank)
  questionType: QuestionType;

  @OneToMany(() => AnswerBank, answerBank => answerBank.question)
  answerBank: AnswerBank[];

  @OneToMany(() => TestQuestion, testQuestion => testQuestion.test)
  testQuestion: TestQuestion[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
