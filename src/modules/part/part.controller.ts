import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PartService } from './part.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { PartDtoRequest, PartDtoResponse } from './dto/PartDto';

@Controller('part')
export class PartController {
  constructor(private readonly skillService: PartService) {}

  @Get()
  async getAll(): Promise<ResponseData<PartDtoResponse[]>> {
    try {
      const data = await this.skillService.findAll();
      return new ResponseData<PartDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<PartDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<PartDtoResponse>> {
    try {
      const data = await this.skillService.findOne(id);
      return new ResponseData<PartDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<PartDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createPart(@Body() createData: PartDtoRequest) {
    try {
      const part = await this.skillService.add(createData);
      return new ResponseData<PartDtoResponse>(
        part,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<PartDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editPart(@Param('id') id: number, @Body() updateData: PartDtoRequest) {
    try {
      const part = await this.skillService.update(id, updateData);
      return new ResponseData<PartDtoResponse>(
        part,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<PartDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deletePart(@Param('id') id: number) {
    try {
      return this.skillService.remove(id);
    } catch (err) {
      return new ResponseData<PartDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
