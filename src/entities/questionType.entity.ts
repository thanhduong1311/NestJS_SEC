import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { QuestionBank } from './questionBank.entity';
import { TestQuestion } from './testQuestion.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'questionType' })
export class QuestionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeName: string;

  @Column()
  code: string;

  @OneToMany(() => QuestionBank, questionBank => questionBank.questionType)
  questionBank: QuestionBank[];

  @OneToMany(() => TestQuestion, testQuestion => testQuestion.type)
  testQuestion: TestQuestion[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
