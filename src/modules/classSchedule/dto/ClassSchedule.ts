import { Classes } from 'src/entities/classes.entity';
import { Course } from 'src/entities/course.entity';

export class ClassScheduleDtoRequest {
  course: Course;

  classes: Classes;

  sectionDate: string;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class ClassScheduleDtoResponse {
  id: number;

  course: Course;

  classes: Classes;

  sectionDate: string;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
