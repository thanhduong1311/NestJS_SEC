import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { ResponseData } from 'src/global/ResponseData';
import {
  StudentDtoRequest,
  StudentDtoDetailResponse,
  StudentDtoResponse
} from './dto/StudentDto';
import { StudentService } from './student.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AdminGuard } from 'src/services/auth/guards/admin.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAll(): Promise<ResponseData<StudentDtoResponse[]>> {
    try {
      const data = await this.studentService.findAll();
      return new ResponseData<StudentDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<StudentDtoResponse>> {
    try {
      const data = await this.studentService.findOneByID(id);
      return new ResponseData<StudentDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createRole(@Body() createData: StudentDtoRequest) {
    try {
      const student = await this.studentService.add(createData);
      return new ResponseData<StudentDtoDetailResponse>(
        student,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editRole(@Param('id') id: number, @Body() updateData: StudentDtoRequest) {
    try {
      const student = await this.studentService.update(id, updateData);
      return new ResponseData<StudentDtoDetailResponse>(
        student,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number) {
    try {
      return this.studentService.remove(id);
    } catch (err) {
      return new ResponseData<StudentDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
