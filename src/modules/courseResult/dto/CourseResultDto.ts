import { Course } from 'src/entities/course.entity';
import { Student } from 'src/entities/student.entity';

export class CourseResultDtoRequest {
  course: Course;

  student: Student;

  result: boolean;

  mark: number;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class CourseResultDtoResponse {
  id: number;

  course: Course;

  student: Student;

  result: boolean;

  mark: number;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
