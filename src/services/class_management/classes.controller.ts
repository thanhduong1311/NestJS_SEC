import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ResponseData } from 'src/global/ResponseData';
import {
  AddStudentsToClassDto,
  ClassDtoRequest,
  PaginationRequest
} from './dto/ClassDto';
import { ClassService } from './classes.service';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('class-management')
export class ClassController {
  constructor(private readonly classesService: ClassService) {}

  @Get('classes')
  @UseGuards(AdminGuard)
  async getAll(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const data = await this.classesService.findAll(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('classes/:id')
  @UseGuards(AdminGuard)
  async getOne(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const data = await this.classesService.findOne(id);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('classes/getStudent/:id')
  @UseGuards(AdminGuard)
  async getStudentInClass(@Param('id') classID: number): Promise<ResponseData<any>> {
    try {
      const data = await this.classesService.getStudentInClass(classID);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('classes/getStudentNotInClass/:id')
  @UseGuards(AdminGuard)
  async getStudentNotInClass(@Param('id') classID: number): Promise<ResponseData<any>> {
    try {
      const data = await this.classesService.getStudentNotInClass(classID);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('classes/create')
  @UseGuards(AdminGuard)
  async createClass(@Body() createData: ClassDtoRequest): Promise<ResponseData<any>> {
    try {
      const classes = await this.classesService.add(createData);
      return new ResponseData<any>(classes, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('classes/update/:id')
  @UseGuards(AdminGuard)
  async editClass(
    @Param('id') id: number,
    @Body() updateData: ClassDtoRequest
  ): Promise<ResponseData<any>> {
    try {
      const classes = await this.classesService.update(id, updateData);
      return new ResponseData<any>(classes, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('classes/update/add-student/:id')
  @UseGuards(AdminGuard)
  async addStudentToClass(
    @Param('id') classID: number,
    @Body() studentData: AddStudentsToClassDto
  ): Promise<ResponseData<any>> {
    try {
      const classes = await this.classesService.addStudentToClass(classID, studentData);
      return new ResponseData<any>(classes, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('classes/update/delete-student/:id')
  @UseGuards(AdminGuard)
  async deleteStudentFromClass(
    @Param('id') classID: number,
    @Body() studentData: AddStudentsToClassDto
  ): Promise<ResponseData<any>> {
    try {
      const classes = await this.classesService.deleteStudentFromClass(
        classID,
        studentData
      );
      return new ResponseData<any>(classes, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('classes/delete/:id')
  @UseGuards(AdminGuard)
  async deleteClass(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.classesService.remove(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }
}
