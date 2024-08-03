import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SkillService } from './skill.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { SkillDtoRequest, SkillDtoResponse } from './dto/SkillDto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  async getAll(): Promise<ResponseData<SkillDtoResponse[]>> {
    try {
      const data = await this.skillService.findAll();
      return new ResponseData<SkillDtoResponse[]>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<SkillDtoResponse[]>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('/:id')
  async getOne(@Param('id') id: number): Promise<ResponseData<SkillDtoResponse>> {
    try {
      const data = await this.skillService.findOne(id);
      return new ResponseData<SkillDtoResponse>(
        data,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<SkillDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Post()
  async createSkill(@Body() createData: SkillDtoRequest) {
    try {
      const skill = await this.skillService.add(createData);
      return new ResponseData<SkillDtoResponse>(
        skill,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<SkillDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('/:id')
  async editSkill(@Param('id') id: number, @Body() updateData: SkillDtoRequest) {
    try {
      const skill = await this.skillService.update(id, updateData);
      return new ResponseData<SkillDtoResponse>(
        skill,
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      return new ResponseData<SkillDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('/:id')
  async deleteSkill(@Param('id') id: number) {
    try {
      return this.skillService.remove(id);
    } catch (err) {
      return new ResponseData<SkillDtoResponse>(null, err, HttpStatus.ERROR);
    }
  }
}
