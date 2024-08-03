import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClassScheduleService } from './classSchedule.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { ClassScheduleDtoRequest, ClassScheduleDtoResponse } from './dto/ClassSchedule';

@Controller('classSchedule')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}

  @Get()
  async getAll(): Promise<ResponseData<ClassScheduleDtoResponse[]>> {
    try {
      const data = await this.classScheduleService.findAll();
      return new ResponseData<ClassScheduleDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassScheduleDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<ClassScheduleDtoResponse>> {
    try {
      const data = await this.classScheduleService.findOne(id);
      return new ResponseData<ClassScheduleDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createClassSchedule(@Body() createData: ClassScheduleDtoRequest) {
    try {
      const classSchedule = await this.classScheduleService.add(createData);
      return new ResponseData<ClassScheduleDtoResponse>(
        classSchedule,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editClassSchedule(
    @Param('id') id: number,
    @Body() updateData: ClassScheduleDtoRequest
  ) {
    try {
      const classSchedule = await this.classScheduleService.update(id, updateData);
      return new ResponseData<ClassScheduleDtoResponse>(
        classSchedule,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteClassSchedule(@Param('id') id: number) {
    try {
      return this.classScheduleService.remove(id);
    } catch (err) {
      return new ResponseData<ClassScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
