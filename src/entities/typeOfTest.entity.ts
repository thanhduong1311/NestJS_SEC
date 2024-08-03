import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Test } from './test.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'typeOfTest' })
export class TypeOfTest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  typeName: string;

  @Column()
  code: string;

  @OneToMany(() => Test, test => test.type)
  test: Test[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
