import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ResponseData } from 'src/global/ResponseData';
import { ClassDtoRequest, ClassDtoResponse } from './dto/ClassDto';
import { ClassService } from './classes.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('classes')
export class ClassController {
  constructor(private readonly classesService: ClassService) {}

  @Get()
  async getAll(): Promise<ResponseData<ClassDtoResponse[]>> {
    try {
      const data = await this.classesService.findAll();
      return new ResponseData<ClassDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<ClassDtoResponse>> {
    try {
      const data = await this.classesService.findOne(id);
      return new ResponseData<ClassDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createRole(@Body() createData: ClassDtoRequest) {
    try {
      const classes = await this.classesService.add(createData);
      return new ResponseData<ClassDtoResponse>(
        classes,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editRole(@Param('id') id: number, @Body() updateData: ClassDtoRequest) {
    try {
      const classes = await this.classesService.update(id, updateData);
      return new ResponseData<ClassDtoResponse>(
        classes,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<ClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number) {
    try {
      return this.classesService.remove(id);
    } catch (err) {
      return new ResponseData<ClassDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
