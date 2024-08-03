import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TestQuestionService } from './testQuestion.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { TestQuestionDtoRequest, TestQuestionDtoResponse } from './dto/TestQuestion';

@Controller('testQuestion')
export class TestQuestionController {
  constructor(private readonly testQuestionService: TestQuestionService) {}

  @Get()
  async getAll(): Promise<ResponseData<TestQuestionDtoResponse[]>> {
    try {
      const data = await this.testQuestionService.findAll();
      return new ResponseData<TestQuestionDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestQuestionDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<TestQuestionDtoResponse>> {
    try {
      const data = await this.testQuestionService.findOne(id);
      return new ResponseData<TestQuestionDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestQuestionDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createTestQuestion(@Body() createData: TestQuestionDtoRequest) {
    try {
      const testQuestion = await this.testQuestionService.add(createData);
      return new ResponseData<TestQuestionDtoResponse>(
        testQuestion,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestQuestionDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editTestQuestion(
    @Param('id') id: number,
    @Body() updateData: TestQuestionDtoRequest
  ) {
    try {
      const testQuestion = await this.testQuestionService.update(id, updateData);
      return new ResponseData<TestQuestionDtoResponse>(
        testQuestion,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TestQuestionDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteTestQuestion(@Param('id') id: number) {
    try {
      return this.testQuestionService.remove(id);
    } catch (err) {
      return new ResponseData<TestQuestionDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
