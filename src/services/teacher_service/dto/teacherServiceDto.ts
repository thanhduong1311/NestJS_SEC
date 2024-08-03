import { IsInt, Min } from 'class-validator';

export class CreateScheduleRequest {
  classID: number;
  sectionDate: string[];
}

export class CreateTestScheduleRequest {
  classID: number;
  testID: number;
  startDate: string;
  endDate: string;
}

export class AttendanceStatus {
  studentID: number;
  isAttend: boolean;
}

export class EditAttendanceStatus {
  attendanceId: number;
  isAttend: boolean;
}

export class TakeAttendanceDto {
  date: string;
  classID: number;
  students: AttendanceStatus[];
}

export class EditAttendanceDto {
  date: string;
  classID: number;
  students: EditAttendanceStatus[];
}

export class ViewAttendanceDto {
  date: string;
  classID: number;
}

export class PaginationRequest {
  classID: string;

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
