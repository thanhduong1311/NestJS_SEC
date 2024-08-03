import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TypeOfTestService } from './typeOfTest.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { TypeOfTestDtoRequest, TypeOfTestDtoResponse } from './dto/TypeOfTestDto';

@Controller('typeOfTest')
export class TypeOfTestController {
  constructor(private readonly typeOfTestService: TypeOfTestService) {}

  @Get()
  async getAll(): Promise<ResponseData<TypeOfTestDtoResponse[]>> {
    try {
      const data = await this.typeOfTestService.findAll();
      return new ResponseData<TypeOfTestDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TypeOfTestDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<TypeOfTestDtoResponse>> {
    try {
      const data = await this.typeOfTestService.findOne(id);
      return new ResponseData<TypeOfTestDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TypeOfTestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createTypeOfTest(@Body() createData: TypeOfTestDtoRequest) {
    try {
      const type = await this.typeOfTestService.add(createData);
      return new ResponseData<TypeOfTestDtoResponse>(
        type,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TypeOfTestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editTypeOfTest(
    @Param('id') id: number,
    @Body() updateData: TypeOfTestDtoRequest
  ) {
    try {
      const type = await this.typeOfTestService.update(id, updateData);
      return new ResponseData<TypeOfTestDtoResponse>(
        type,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<TypeOfTestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteTypeOfTest(@Param('id') id: number) {
    try {
      return this.typeOfTestService.remove(id);
    } catch (err) {
      return new ResponseData<TypeOfTestDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
