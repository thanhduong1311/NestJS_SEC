import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CourseService } from './course.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CourseDtoRequest, CourseDtoResponse } from './dto/CourseDto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getAll(): Promise<ResponseData<CourseDtoResponse[]>> {
    try {
      const data = await this.courseService.findAll();
      return new ResponseData<CourseDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<CourseDtoResponse>> {
    try {
      const data = await this.courseService.findOne(id);
      return new ResponseData<CourseDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createCourse(@Body() createData: CourseDtoRequest) {
    try {
      const course = await this.courseService.add(createData);
      return new ResponseData<CourseDtoResponse>(
        course,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editCourse(@Param('id') id: number, @Body() updateData: CourseDtoRequest) {
    try {
      const course = await this.courseService.update(id, updateData);
      return new ResponseData<CourseDtoResponse>(
        course,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteCourse(@Param('id') id: number) {
    try {
      return this.courseService.remove(id);
    } catch (err) {
      return new ResponseData<CourseDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
