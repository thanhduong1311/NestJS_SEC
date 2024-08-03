import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ResponseData } from 'src/global/ResponseData';
import {
  AdminDtoRequest,
  AdminDtoDetailResponse,
  AdminDtoResponse
} from './dto/adminDto';
import { AdminService } from './admin.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async getAll(): Promise<ResponseData<AdminDtoResponse[]>> {
    try {
      const data = await this.adminService.findAll();
      return new ResponseData<AdminDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AdminDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOneByID(@Param('id') id: number): Promise<ResponseData<AdminDtoResponse>> {
    try {
      const data = await this.adminService.findOneByID(id);
      return new ResponseData<AdminDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AdminDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createRole(@Body() createData: AdminDtoRequest) {
    try {
      const admin = await this.adminService.add(createData);
      return new ResponseData<AdminDtoDetailResponse>(
        admin,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AdminDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editRole(@Param('id') id: number, @Body() updateData: AdminDtoRequest) {
    try {
      const admin = await this.adminService.update(id, updateData);
      return new ResponseData<AdminDtoDetailResponse>(
        admin,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<AdminDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number) {
    try {
      return this.adminService.remove(id);
    } catch (err) {
      return new ResponseData<AdminDtoDetailResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
