import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { StudentInClassService } from './studentnClass.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import {
  StudentInClassDtoRequest,
  StudentInClassDtoResponse
} from './dto/StudentInClassDto';

@Controller('studentInClass')
export class StudentInClassController {
  constructor(private readonly studentInClassService: StudentInClassService) {}

  @Get()
  async getAll(): Promise<ResponseData<StudentInClassDtoResponse[]>> {
    try {
      const data = await this.studentInClassService.findAll();
      return new ResponseData<StudentInClassDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentInClassDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(
    @Param('id') id: number
  ): Promise<ResponseData<StudentInClassDtoResponse>> {
    try {
      const data = await this.studentInClassService.findOne(id);
      return new ResponseData<StudentInClassDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentInClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createStudentInClass(@Body() createData: StudentInClassDtoRequest) {
    try {
      const studentInClass = await this.studentInClassService.add(createData);
      return new ResponseData<StudentInClassDtoResponse>(
        studentInClass,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentInClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editStudentInClass(
    @Param('id') id: number,
    @Body() updateData: StudentInClassDtoRequest
  ) {
    try {
      const studentInClass = await this.studentInClassService.update(id, updateData);
      return new ResponseData<StudentInClassDtoResponse>(
        studentInClass,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<StudentInClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteStudentInClass(@Param('id') id: number) {
    try {
      return this.studentInClassService.remove(id);
    } catch (err) {
      return new ResponseData<StudentInClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
