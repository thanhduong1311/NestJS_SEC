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
  pageData: AdminResponse[] | StudentResponse[] | TeacherResponse[];
  meta: {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export class AdminResponse {
  id: number;

  name: string;

  email: string;

  username: string;

  avatar: string;

  status: string;

  createAt: string;
}

export class CreateAdminDto {
  name: string;

  email: string;

  username: string;

  password: string;
}

export class UpdateAdminDto {
  name: string;

  email: string;

  username: string;

  password: string;
}

export class TeacherResponse {
  id: number;

  name: string;

  phone: string;

  email: string;

  username: string;

  avatar: string;

  dob: string;

  address: string;

  status: string;

  createAt: string;
}

export class CreateTeacherDto {
  name: string;

  email: string;

  phone: string;

  username: string;

  password: string;

  address: string;

  dob: string;
}

export class UpdateTeacherDto {
  name: string;

  email: string;

  phone: string;

  username: string;

  password: string;

  address: string;

  dob: string;
}

export class StudentResponse {
  id: number;

  name: string;

  phone: string;

  email: string;

  username: string;

  avatar: string;

  dob: string;

  address: string;

  status: string;

  createAt: string;
}

export class CreateStudentDto {
  name: string;

  email: string;

  phone: string;

  username: string;

  password: string;

  address: string;

  dob: string;
}

export class UpdateStudentDto {
  name: string;

  email: string;

  phone: string;

  username: string;

  password: string;

  address: string;

  dob: string;
}
