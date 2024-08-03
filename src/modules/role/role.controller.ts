import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { RoleDtoRequest, RoleDtoResponse } from './dto/roleDto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async getAll(): Promise<ResponseData<RoleDtoResponse[]>> {
    try {
      const data = await this.roleService.findAll();
      return new ResponseData<RoleDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<RoleDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<RoleDtoResponse>> {
    try {
      const data = await this.roleService.findOne(id);
      return new ResponseData<RoleDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<RoleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createRole(@Body() createData: RoleDtoRequest) {
    try {
      const role = await this.roleService.add(createData);
      return new ResponseData<RoleDtoResponse>(
        role,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<RoleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editRole(@Param('id') id: number, @Body() updateData: RoleDtoRequest) {
    try {
      const role = await this.roleService.update(id, updateData);
      return new ResponseData<RoleDtoResponse>(
        role,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<RoleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number) {
    try {
      return this.roleService.remove(id);
    } catch (err) {
      return new ResponseData<RoleDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
