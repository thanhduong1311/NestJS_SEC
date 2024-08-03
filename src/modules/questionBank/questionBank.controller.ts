import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { QuestionBankService } from './questionBank.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { QuestionBankDtoRequest, QuestionBankDtoResponse } from './dto/QuestionBank';

@Controller('questionBank')
export class QuestionBankController {
  constructor(private readonly questionBankService: QuestionBankService) {}

  @Get()
  async getAll(): Promise<ResponseData<QuestionBankDtoResponse[]>> {
    try {
      const data = await this.questionBankService.findAll();
      return new ResponseData<QuestionBankDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionBankDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<QuestionBankDtoResponse>> {
    try {
      const data = await this.questionBankService.findOne(id);
      return new ResponseData<QuestionBankDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionBankDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createQuestionBank(@Body() createData: QuestionBankDtoRequest) {
    try {
      const questionBank = await this.questionBankService.add(createData);
      return new ResponseData<QuestionBankDtoResponse>(
        questionBank,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionBankDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editQuestionBank(
    @Param('id') id: number,
    @Body() updateData: QuestionBankDtoRequest
  ) {
    try {
      const questionBank = await this.questionBankService.update(id, updateData);
      return new ResponseData<QuestionBankDtoResponse>(
        questionBank,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<QuestionBankDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteQuestionBank(@Param('id') id: number) {
    try {
      return this.questionBankService.remove(id);
    } catch (err) {
      return new ResponseData<QuestionBankDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
