import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Test } from './test.entity';
import { QuestionBank } from './questionBank.entity';
import { Part } from './part.entity';
import { QuestionType } from './questionType.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'testQuestion' })
export class TestQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Test, test => test.testQuestion)
  test: Test;

  @ManyToOne(() => QuestionBank, questionBank => questionBank.testQuestion)
  question: QuestionBank;

  @ManyToOne(() => QuestionType, typeOfTest => typeOfTest.testQuestion)
  type: QuestionType;

  @ManyToOne(() => Part, part => part.testQuestion)
  part: Part;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
