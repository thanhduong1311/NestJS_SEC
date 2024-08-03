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
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AccountManagementService } from './accountManagement.service';
import {
  CreateAdminDto,
  CreateStudentDto,
  CreateTeacherDto,
  PaginationRequest,
  UpdateAdminDto,
  UpdateStudentDto,
  UpdateTeacherDto
} from './dto/AccountManagementDto';

@Controller('account-management')
export class AccountManagementController {
  constructor(private readonly accountManagementService: AccountManagementService) {}

  @Get('admins')
  @UseGuards(AdminGuard)
  async getAllAdmins(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.getAdminList(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('admins/:id')
  @UseGuards(AdminGuard)
  async getAdmin(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.getAnAdmin(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('admins/create')
  @UseGuards(AdminGuard)
  async createAdmin(@Body() createData: CreateAdminDto): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.createAdmin(createData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('admins/update/:id')
  @UseGuards(AdminGuard)
  async updateAdmin(
    @Param('id') id: number,
    @Body() updateData: UpdateAdminDto
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.updateAdmin(id, updateData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('admins/delete/:id')
  @UseGuards(AdminGuard)
  async deleteAdmin(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.deleteAdmin(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('students')
  @UseGuards(AdminGuard)
  async getAllStudents(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.getStudentList(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('students/pending')
  @UseGuards(AdminGuard)
  async getAllPendingStudent(): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.getAllPendingStudent();
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('students/:id')
  @UseGuards(AdminGuard)
  async getStudent(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.getAStudent(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('students/create')
  @UseGuards(AdminGuard)
  async createStudent(@Body() createData: CreateStudentDto): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.createStudent(createData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('students/update/:id')
  @UseGuards(AdminGuard)
  async updateStudent(
    @Param('id') id: number,
    @Body() updateData: UpdateStudentDto
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.updateStudent(id, updateData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('students/delete/:id')
  @UseGuards(AdminGuard)
  async deleteStudent(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.deleteStudent(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('students/approve-account/:username')
  @UseGuards(AdminGuard)
  async approveAccount(@Param('username') username: string): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.approveAccount(username);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('students/reject-account/:username')
  @UseGuards(AdminGuard)
  async rejectAccount(@Param('username') username: string): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.rejectAccount(username);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('teachers')
  @UseGuards(AdminGuard)
  async getAllTeachers(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.getTeacherList(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('teachers/:id')
  @UseGuards(AdminGuard)
  async getTeacher(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.getATeacher(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('teachers/create')
  @UseGuards(AdminGuard)
  async createTeacher(@Body() createData: CreateTeacherDto): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.createTeacher(createData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('teachers/update/:id')
  @UseGuards(AdminGuard)
  async updateTeacher(
    @Param('id') id: number,
    @Body() updateData: UpdateTeacherDto
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.updateTeacher(id, updateData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('teachers/delete/:id')
  @UseGuards(AdminGuard)
  async deleteTeacher(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.deleteTeacher(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('active-account/:username')
  @UseGuards(AdminGuard)
  async activeAccount(@Param('username') username: string): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.activeAccount(username);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('disable-account/:username')
  @UseGuards(AdminGuard)
  async disableAccount(@Param('username') username: string): Promise<ResponseData<any>> {
    try {
      const response = await this.accountManagementService.disableAccount(username);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }
}
