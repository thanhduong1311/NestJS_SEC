import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TestScheduleService } from './testSchedule.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { TestScheduleDtoRequest, TestScheduleDtoResponse } from './dto/TestScheduleDto';

@Controller('testSchedule')
export class TestScheduleController {
  constructor(private readonly testScheduleService: TestScheduleService) {}

  @Get()
  async getAll(): Promise<ResponseData<TestScheduleDtoResponse[]>> {
    try {
      const data = await this.testScheduleService.findAll();
      return new ResponseData<TestScheduleDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestScheduleDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<TestScheduleDtoResponse>> {
    try {
      const data = await this.testScheduleService.findOne(id);
      return new ResponseData<TestScheduleDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createTestSchedule(@Body() createData: TestScheduleDtoRequest) {
    try {
      const admin = await this.testScheduleService.add(createData);
      return new ResponseData<TestScheduleDtoResponse>(
        admin,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editTestSchedule(
    @Param('id') id: number,
    @Body() updateData: TestScheduleDtoRequest
  ) {
    try {
      const admin = await this.testScheduleService.update(id, updateData);
      return new ResponseData<TestScheduleDtoResponse>(
        admin,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteTestSchedule(@Param('id') id: number) {
    try {
      return this.testScheduleService.remove(id);
    } catch (err) {
      return new ResponseData<TestScheduleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
