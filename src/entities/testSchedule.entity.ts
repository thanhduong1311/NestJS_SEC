import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Classes } from './classes.entity';
import { Test } from './test.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'testSchedule' })
export class TestSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @ManyToOne(() => Classes, classes => classes.testSchedule)
  class: Classes;

  @ManyToOne(() => Test, test => test.testSchedule)
  test: Test;

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
