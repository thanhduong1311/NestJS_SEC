import { IsInt, Min } from 'class-validator';

export class StudentInfoDto {
  username: string | null;
}

export class ClassInfoDto {
  classID: number;
}

export class SectionDayDto {
  id: number;
  sectionDate: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
}

export class TestDateDto {
  id: number;
  startDate: string;
  endDate: string;
  classId: number;
  className: string;
  totalTime: number;
  type: string;
}

export class UpdateProfileRequestDto {
  name: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
}

export class SettingDto {
  language: string;
  theme: string;
}

export class PaginationRequest {
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsInt()
  @Min(1)
  pageNumber: number = 1;
}

export class PaginationResponse {
  pageData: any;
  meta: {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}
