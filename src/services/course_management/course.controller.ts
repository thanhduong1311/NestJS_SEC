import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { CourseService } from './course.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { CourseDtoRequest, CourseDtoResponse, PaginationRequest } from './dto/CourseDto';
import { AdminAndTeacherGuard } from '../auth/guards/adminAndTeacher.guard';

@Controller('course-management')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  @UseGuards(AdminAndTeacherGuard)
  async getAll(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const data = await this.courseService.findAll(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('courses/:id')
  @UseGuards(AdminAndTeacherGuard)
  async getOne(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const data = await this.courseService.findOne(id);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('courses/create')
  @UseGuards(AdminAndTeacherGuard)
  async createCourse(@Body() createData: CourseDtoRequest): Promise<ResponseData<any>> {
    try {
      const course = await this.courseService.add(createData);
      return new ResponseData<any>(course, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('courses/update/:id')
  @UseGuards(AdminAndTeacherGuard)
  async editCourse(
    @Param('id') id: number,
    @Body() updateData: CourseDtoRequest
  ): Promise<ResponseData<any>> {
    try {
      const course = await this.courseService.update(id, updateData);
      return new ResponseData<any>(course, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('courses/delete/:id')
  @UseGuards(AdminAndTeacherGuard)
  async deleteCourse(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.courseService.remove(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<CourseDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
