import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ResponseData } from 'src/global/ResponseData';
import {
  TeacherDtoRequest,
  TeacherDtoDetailResponse,
  TeacherDtoResponse
} from './dto/teacherDto';
import { TeacherService } from './teacher.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async getAll(): Promise<ResponseData<TeacherDtoResponse[]>> {
    try {
      const data = await this.teacherService.findAll();
      return new ResponseData<TeacherDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TeacherDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<TeacherDtoResponse>> {
    try {
      const data = await this.teacherService.findOneByID(id);
      return new ResponseData<TeacherDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TeacherDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createRole(@Body() createData: TeacherDtoRequest) {
    try {
      const teacher = await this.teacherService.add(createData);
      return new ResponseData<TeacherDtoDetailResponse>(
        teacher,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TeacherDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editRole(@Param('id') id: number, @Body() updateData: TeacherDtoRequest) {
    try {
      const teacher = await this.teacherService.update(id, updateData);
      return new ResponseData<TeacherDtoDetailResponse>(
        teacher,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TeacherDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number) {
    try {
      return this.teacherService.remove(id);
    } catch (err) {
      return new ResponseData<TeacherDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
