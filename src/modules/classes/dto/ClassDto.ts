import { Course } from 'src/entities/course.entity';
import { Teacher } from 'src/entities/teacher.entity';

export class ClassDtoRequest {
  className: string;

  teacher: Teacher;

  course: Course;

  enrollerCount: number;

  createBy: string;

  updateBy: string;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class ClassDtoResponse {
  id: number;

  className: string;

  teacher: Teacher;

  course: Course;

  enrollerCount: number;

  createBy: string;

  updateBy: string;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
