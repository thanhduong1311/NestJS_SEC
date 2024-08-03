import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CourseResultDtoRequest, CourseResultDtoResponse } from './dto/CourseResultDto';
import { CourseResultService } from './courseResult.service';

@Controller('courseResult')
export class CourseResultController {
  constructor(private readonly courseResultService: CourseResultService) {}

  @Get()
  async getAll(): Promise<ResponseData<CourseResultDtoResponse[]>> {
    try {
      const data = await this.courseResultService.findAll();
      return new ResponseData<CourseResultDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseResultDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<CourseResultDtoResponse>> {
    try {
      const data = await this.courseResultService.findOne(id);
      return new ResponseData<CourseResultDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseResultDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createCourseResult(@Body() createData: CourseResultDtoRequest) {
    try {
      const CourseResult = await this.courseResultService.add(createData);
      return new ResponseData<CourseResultDtoResponse>(
        CourseResult,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseResultDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editCourseResult(
    @Param('id') id: number,
    @Body() updateData: CourseResultDtoRequest
  ) {
    try {
      const CourseResult = await this.courseResultService.update(id, updateData);
      return new ResponseData<CourseResultDtoResponse>(
        CourseResult,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<CourseResultDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteCourseResult(@Param('id') id: number) {
    try {
      return this.courseResultService.remove(id);
    } catch (err) {
      return new ResponseData<CourseResultDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
