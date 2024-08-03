import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AttendanceDtoRequest, AttendanceDtoResponse } from './dto/AttendanceDto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async getAll(): Promise<ResponseData<AttendanceDtoResponse[]>> {
    try {
      const data = await this.attendanceService.findAll();
      return new ResponseData<AttendanceDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AttendanceDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<AttendanceDtoResponse>> {
    try {
      const data = await this.attendanceService.findOne(id);
      return new ResponseData<AttendanceDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AttendanceDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createAttendance(@Body() createData: AttendanceDtoRequest) {
    try {
      const attendance = await this.attendanceService.add(createData);
      return new ResponseData<AttendanceDtoResponse>(
        attendance,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AttendanceDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editAttendance(
    @Param('id') id: number,
    @Body() updateData: AttendanceDtoRequest
  ) {
    try {
      const attendance = await this.attendanceService.update(id, updateData);
      return new ResponseData<AttendanceDtoResponse>(
        attendance,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AttendanceDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteAttendance(@Param('id') id: number) {
    try {
      return this.attendanceService.remove(id);
    } catch (err) {
      return new ResponseData<AttendanceDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
