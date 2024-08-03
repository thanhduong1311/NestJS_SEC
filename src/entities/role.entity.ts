import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Admin } from './admin.entity';
import { Student } from './student.entity';
import { formatDate } from 'src/utils/dateFormat';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext' })
  roleName: string;

  @OneToMany(() => Teacher, teacher => teacher.role)
  teachers: Teacher[];

  @OneToMany(() => Admin, admin => admin.role)
  admins: Admin[];

  @OneToMany(() => Student, student => student.role)
  students: Student[];

  @Column({ default: formatDate(new Date()) })
  createAt: string;

  @Column({ default: formatDate(new Date()) })
  updateAt: string;

  @Column({ default: null, nullable: true })
  deleteAt: string;
}
