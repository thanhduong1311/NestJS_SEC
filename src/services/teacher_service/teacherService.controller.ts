import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { TeacherService } from './teacherService.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import {
  CreateScheduleRequest,
  CreateTestScheduleRequest,
  EditAttendanceDto,
  TakeAttendanceDto,
  ViewAttendanceDto
} from './dto/teacherServiceDto';
import { TeacherGuard } from '../auth/guards/teacher.guard';

@Controller('app/teacher')
export class TeacherServiceController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('createClassSchedule')
  @UseGuards(TeacherGuard)
  async createClassSchedule(@Body() createData: CreateScheduleRequest) {
    try {
      const response = await this.teacherService.createClassSchedule(createData);

      return new ResponseData<any>({ response }, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Post('updateClassSchedule')
  @UseGuards(TeacherGuard)
  async updateClassSchedule(@Body() createData: CreateScheduleRequest) {
    try {
      const response = await this.teacherService.updateClassSchedule(createData);

      return new ResponseData<any>({ response }, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Post('createTestSchedule')
  @UseGuards(TeacherGuard)
  async createTestSchedule(@Body() createData: CreateTestScheduleRequest) {
    try {
      const response = await this.teacherService.createTestSchedule(createData);

      return new ResponseData<any>({ response }, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Post('updateTestSchedule')
  @UseGuards(TeacherGuard)
  async updateTestSchedule(@Body() createData: CreateTestScheduleRequest) {
    try {
      const response = await this.teacherService.updateTestSchedule(createData);

      return new ResponseData<any>({ response }, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Get('classAllClassSchedule')
  @UseGuards(TeacherGuard)
  async classAllClassSchedule(@Req() req: any): Promise<ResponseData<any>> {
    try {
      const response = await this.teacherService.classAllClassSchedule(
        req.current_user.id
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Get('getStudentInClass/:id')
  @UseGuards(TeacherGuard)
  async getStudentInClass(@Param('id') classID: number): Promise<ResponseData<any>> {
    try {
      const data = await this.teacherService.getStudentInClass(classID);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('takeAttendance')
  @UseGuards(TeacherGuard)
  async takeAttendance(
    @Body() attendanceData: TakeAttendanceDto
  ): Promise<ResponseData<any>> {
    try {
      const data = await this.teacherService.takeAttendance(attendanceData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('editAttendance')
  @UseGuards(TeacherGuard)
  async editAttendance(
    @Body() attendanceData: EditAttendanceDto
  ): Promise<ResponseData<any>> {
    try {
      const data = await this.teacherService.editAttendance(attendanceData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('getAttendance')
  @UseGuards(TeacherGuard)
  async getAttendance(
    @Query() attendanceData: ViewAttendanceDto
  ): Promise<ResponseData<any>> {
    try {
      const data = await this.teacherService.getAttendance(attendanceData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }
}
