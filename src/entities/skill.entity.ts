import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Part } from './part.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'skill' })
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skillName: string;

  @Column()
  code: string;

  @OneToMany(() => Part, part => part.skill)
  part: Part[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
