import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TestService } from './test.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { TestDtoRequest, TestDtoResponse } from './dto/TestDto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  async getAll(): Promise<ResponseData<TestDtoResponse[]>> {
    try {
      const data = await this.testService.findAll();
      return new ResponseData<TestDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<TestDtoResponse>> {
    try {
      const data = await this.testService.findOne(id);
      return new ResponseData<TestDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createTest(@Body() createData: TestDtoRequest) {
    try {
      const test = await this.testService.add(createData);
      return new ResponseData<TestDtoResponse>(
        test,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editTest(@Param('id') id: number, @Body() updateData: TestDtoRequest) {
    try {
      const test = await this.testService.update(id, updateData);
      return new ResponseData<TestDtoResponse>(
        test,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteTest(@Param('id') id: number) {
    try {
      return this.testService.remove(id);
    } catch (err) {
      return new ResponseData<TestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
