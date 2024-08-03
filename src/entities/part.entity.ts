import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Skill } from './skill.entity';
import { TestQuestion } from './testQuestion.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'part' })
export class Part {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  partName: string;

  @Column()
  data: string;

  @Column()
  index: number;

  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Column({ type: 'mediumtext', nullable: true })
  file: string;

  @ManyToOne(() => Skill, skill => skill.part)
  skill: Skill;

  @OneToMany(() => TestQuestion, testQuestion => testQuestion.part)
  testQuestion: TestQuestion[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
