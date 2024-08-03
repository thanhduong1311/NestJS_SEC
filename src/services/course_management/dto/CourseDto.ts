import { IsInt, Min } from 'class-validator';

export class PaginationRequest {
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsInt()
  @Min(1)
  pageNumber: number = 1;
}

export class PaginationResponse {
  pageData: CourseDtoResponse[];
  meta: {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export class CourseDtoRequest {
  courseName: string;

  description: string;

  startDate: string;

  numberOfLesson: number;

  endDate: string;

  createBy: string;

  updateBy: string;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
export class CourseDtoResponse {
  id: number;

  courseName: string;

  description: string;

  numberOfLesson: number;

  startDate: string;

  endDate: string;

  createBy: string;

  updateBy: string;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
