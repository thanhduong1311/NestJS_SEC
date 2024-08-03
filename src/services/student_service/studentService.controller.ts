import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { StudentService } from './studentService.service';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import { StudentGuard } from '../auth/guards/student.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  PaginationRequest,
  SettingDto,
  UpdateProfileRequestDto
} from './dto/studentServiceDto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { extname } from 'path/win32';

@Controller('app/student')
export class StudentServiceController {
  constructor(
    private readonly studentService: StudentService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Get('classes')
  @UseGuards(StudentGuard)
  async getClasses(@Req() req: any): Promise<ResponseData<any>> {
    try {
      const response = await this.studentService.getClassByUsername(
        req.current_user.username
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Get('schedule/:classID')
  @UseGuards(StudentGuard)
  async getSchedule(@Param('classID') classID: number): Promise<ResponseData<any>> {
    try {
      const response = await this.studentService.getScheduleByClass(classID);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Get('testSchedule/:classID')
  @UseGuards(StudentGuard)
  async getTestSchedule(@Param('classID') classID: number): Promise<ResponseData<any>> {
    try {
      const response = await this.studentService.getTestScheduleByClass(classID);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Get('practiceTest')
  @UseGuards(StudentGuard)
  async getPracticeTest(@Req() req: any): Promise<ResponseData<any>> {
    try {
      const response = await this.studentService.getPracticesExam(
        req.current_user.username
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Get('/attendance')
  @UseGuards(StudentGuard)
  async getAttendance(
    @Req() req: any,
    @Query('classID') classID: string,
    @Query() paginationRequest: PaginationRequest
  ) {
    try {
      const response = await this.studentService.getAttendance(
        req.current_user.username,
        classID,
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Post('update-profile')
  @UseGuards(StudentGuard)
  async updateProfile(@Req() req: any, @Body() profileInfo: UpdateProfileRequestDto) {
    try {
      const username = req.current_user.username;
      const response = await this.studentService.updateProfile(username, profileInfo);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Post('change-setting')
  @UseGuards(StudentGuard)
  async changeSetting(@Req() req: any, @Body() settings: SettingDto) {
    try {
      const username = req.current_user.username;
      const response = await this.studentService.updateSettings(username, settings);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Post('upload-avatar')
  @UseGuards(StudentGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.arw', '.webp'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong file extension. Accept only: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File is too larger. Accept only file under 5MB`;
            cb(null, false);
          } else {
            cb(null, true);
          }
        }
      }
    })
  )
  async uploadImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    try {
      if (req.fileValidationError) {
        throw new BadRequestException(req.fileValidationError);
      }

      if (!file) {
        throw new BadRequestException('File is required!');
      }

      const upload = await this.cloudinaryService.uploadFile(file);

      this.studentService.uploadAvatar(req.current_user.id, upload.url);

      return new ResponseData<any>(
        { uploadedFile: upload.url },
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }

  @Get('view-test-paper/:id')
  @UseGuards(StudentGuard)
  async viewTestPaper(@Param('id') testID: number) {
    try {
      const response = await this.studentService.getTestPaper(testID);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }
}
