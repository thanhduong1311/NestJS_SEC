import { Classes } from 'src/entities/classes.entity';
import { Student } from 'src/entities/student.entity';

export class StudentInClassDtoRequest {
  student: Student;

  classes: Classes;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class StudentInClassDtoResponse {
  id: number;

  student: Student;

  classes: Classes;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
