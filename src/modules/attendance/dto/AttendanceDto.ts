import { Classes } from 'src/entities/classes.entity';
import { Student } from 'src/entities/student.entity';

export class AttendanceDtoRequest {
  classes: Classes;

  student: Student;

  date: string;

  isAttended: boolean;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class AttendanceDtoResponse {
  id: number;

  classes: Classes;

  student: Student;

  date: string;

  isAttended: boolean;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
