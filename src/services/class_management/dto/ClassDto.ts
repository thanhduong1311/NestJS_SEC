import { IsInt, Min } from 'class-validator';
import { Course } from 'src/entities/course.entity';
import { Teacher } from 'src/entities/teacher.entity';

export class PaginationRequest {
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsInt()
  @Min(1)
  pageNumber: number = 1;
}

export class PaginationResponse {
  pageData: any[];
  meta: {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

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

export class AddStudentsToClassDto {
  studentIds: number[];
}

export class ClassDtoResponse {
  id: number;

  className: string;

  teacher: string;

  course: string;

  enrollerCount: number;

  createBy: string;

  updateBy: string;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
