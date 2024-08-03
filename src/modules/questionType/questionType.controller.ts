import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { QuestionTypeService } from './questionType.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { QuestionTypeDtoRequest, QuestionTypeDtoResponse } from './dto/QuestionTypeDto';

@Controller('questionType')
export class QuestionTypeController {
  constructor(private readonly questionTypeService: QuestionTypeService) {}

  @Get()
  async getAll(): Promise<ResponseData<QuestionTypeDtoResponse[]>> {
    try {
      const data = await this.questionTypeService.findAll();
      return new ResponseData<QuestionTypeDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionTypeDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<QuestionTypeDtoResponse>> {
    try {
      const data = await this.questionTypeService.findOne(id);
      return new ResponseData<QuestionTypeDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionTypeDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createQuestionType(@Body() createData: QuestionTypeDtoRequest) {
    try {
      const questionType = await this.questionTypeService.add(createData);
      return new ResponseData<QuestionTypeDtoResponse>(
        questionType,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionTypeDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editQuestionType(
    @Param('id') id: number,
    @Body() updateData: QuestionTypeDtoRequest
  ) {
    try {
      const questionType = await this.questionTypeService.update(id, updateData);
      return new ResponseData<QuestionTypeDtoResponse>(
        questionType,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionTypeDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteQuestionType(@Param('id') id: number) {
    try {
      return this.questionTypeService.remove(id);
    } catch (err) {
      return new ResponseData<QuestionTypeDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
