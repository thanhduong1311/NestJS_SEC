import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Classes } from 'src/entities/classes.entity';
import { Course } from 'src/entities/course.entity';
import { Student } from 'src/entities/student.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student) readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher) readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Course) readonly courseRepository: Repository<Course>,
    @InjectRepository(Classes) readonly classesRepository: Repository<Classes>
  ) {}

  async getData(): Promise<any> {
    const students = await this.studentRepository.count();
    const teacher = await this.teacherRepository.count();
    const course = await this.courseRepository.count();
    const classes = await this.classesRepository.count();

    return {
      statistic: {
        students,
        teacher,
        course,
        classes
      }
    };
  }
}
