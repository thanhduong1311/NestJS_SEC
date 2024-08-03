import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { TestQuestion } from './testQuestion.entity';
import { TypeOfTest } from './typeOfTest.entity';
import { TestSchedule } from './testSchedule.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'test' })
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  testName: string;

  @ManyToOne(() => TypeOfTest, typeOfTest => typeOfTest.test)
  type: TypeOfTest;

  @Column()
  createBy: string;

  @Column()
  updateBy: string;

  @Column()
  totalTime: number;

  @OneToMany(() => TestQuestion, testQuestion => testQuestion.test)
  testQuestion: TestQuestion[];

  @OneToMany(() => TestSchedule, testSchedule => testSchedule.test)
  testSchedule: TestSchedule[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
