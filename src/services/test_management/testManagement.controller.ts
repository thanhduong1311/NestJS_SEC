import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ResponseData } from 'src/global/ResponseData';
import { HttpMessage, HttpStatus } from 'src/global/globalEnum';
import {
  AnswerBankDtoRequest,
  CreateTestTemplateRequest,
  GetQuestionDto,
  PaginationRequest,
  PartDto,
  QuestionBankDtoRequest,
  QuestionWithAnswerDtoRequest,
  TestDtoRequest
} from './dto/testManagementDto';
import { TestManagementService } from './testManagement.service';
import { AdminAndTeacherGuard } from '../auth/guards/adminAndTeacher.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('test-management')
export class TestManagementController {
  constructor(
    private readonly testManagementService: TestManagementService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // Manage question bank
  @Get('question')
  @UseGuards(AdminAndTeacherGuard)
  async getAllQuestions(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.testManagementService.findAllQuestion(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('question/get/:id')
  @UseGuards(AdminAndTeacherGuard)
  async getOneQuestion(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.testManagementService.findOneQuestion(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('question/create')
  @UseGuards(AdminAndTeacherGuard)
  async createQuestionBank(
    @Body() createData: QuestionBankDtoRequest
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.testManagementService.addQuestion(createData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('question/create-question-with-answers')
  @UseGuards(AdminAndTeacherGuard)
  async createQuestionWithAnswers(
    @Body() createData: QuestionWithAnswerDtoRequest
  ): Promise<ResponseData<any>> {
    try {
      const response =
        await this.testManagementService.addQuestionWithAnswers(createData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('question/update/:id')
  @UseGuards(AdminAndTeacherGuard)
  async editQuestionBank(
    @Param('id') id: number,
    @Body() updateData: QuestionBankDtoRequest
  ): Promise<ResponseData<any>> {
    try {
      const response = await this.testManagementService.updateQuestion(id, updateData);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('question/delete/:id')
  @UseGuards(AdminAndTeacherGuard)
  async deleteQuestionBank(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const response = await this.testManagementService.removeQuestion(id);
      return new ResponseData<any>(response, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  // Manage answer bank
  @Get('answer')
  @UseGuards(AdminAndTeacherGuard)
  async getAllAnswer(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const data = await this.testManagementService.findAllAnswer(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('answer/get/:id')
  @UseGuards(AdminAndTeacherGuard)
  async getOneAnswer(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const data = await this.testManagementService.findOneAnswer(id);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('answer/create')
  @UseGuards(AdminAndTeacherGuard)
  async createAnswer(@Body() createData: AnswerBankDtoRequest) {
    try {
      const data = await this.testManagementService.addAnswer(createData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('answer/update/:id')
  @UseGuards(AdminAndTeacherGuard)
  async editAnswer(@Param('id') id: number, @Body() updateData: AnswerBankDtoRequest) {
    try {
      const data = await this.testManagementService.updateAnswer(id, updateData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('answer/delete/:id')
  @UseGuards(AdminAndTeacherGuard)
  async deleteAnswer(@Param('id') id: number) {
    try {
      const data = await this.testManagementService.removeAnswer(id);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  // For test
  @Post('question/full-answer')
  @UseGuards(AdminAndTeacherGuard)
  async getAnswerForQuestion(@Body() questionsId: GetQuestionDto) {
    try {
      const data = await this.testManagementService.getAnswerForQuestion(questionsId.ids);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('question/full-answer-for-test')
  @UseGuards(AdminAndTeacherGuard)
  async getAnswerForTestQuestion(@Body() questionsId: GetQuestionDto) {
    try {
      const data = await this.testManagementService.getAnswerForTestQuestion(
        questionsId.ids
      );
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }
  @Get('question/types')
  @UseGuards(AdminAndTeacherGuard)
  async getAllTypeOfQuestion() {
    try {
      const data = await this.testManagementService.getAllTypeOfQuestion();
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }
  @Get('question/typeOfTest')
  @UseGuards(AdminAndTeacherGuard)
  async getAllTypeOfTest() {
    try {
      const data = await this.testManagementService.getAllTypeOfTest();
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('skill/get')
  @UseGuards(AdminAndTeacherGuard)
  async getAllSkill() {
    try {
      const data = await this.testManagementService.getAllSkill();
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  // Manage tests template
  @Get('view-test/:id')
  async viewATest(@Param('id') testID: number) {
    try {
      const data = await this.testManagementService.viewATest(testID);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('createPartTest')
  @UseGuards(AdminAndTeacherGuard)
  async createPart(@Body() createData: PartDto) {
    try {
      const data = await this.testManagementService.addPart(createData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('create-test-template')
  async createATestTemplate(@Body() createData: CreateTestTemplateRequest) {
    try {
      const data = await this.testManagementService.addTestTemplate(createData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('edit-test-template')
  async editATestTemplate(@Body() createData: CreateTestTemplateRequest) {
    try {
      const data = await this.testManagementService.editTestTemplate(createData);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  // Test management
  @Get('test')
  @UseGuards(AdminAndTeacherGuard)
  async getAll(
    @Query() paginationRequest: PaginationRequest
  ): Promise<ResponseData<any>> {
    try {
      const data = await this.testManagementService.findAllTest(
        paginationRequest.pageSize,
        paginationRequest.pageNumber
      );
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('test-of-class/:id')
  @UseGuards(AdminAndTeacherGuard)
  async getAllTestOfClass(@Param('id') classID: number): Promise<ResponseData<any>> {
    try {
      const data = await this.testManagementService.findAllTestOfClass(classID);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Get('test/:id')
  @UseGuards(AdminAndTeacherGuard)
  async getOne(@Param('id') id: number): Promise<ResponseData<any>> {
    try {
      const data = await this.testManagementService.findOneTest(id);
      return new ResponseData<any>(data, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('test/create')
  @UseGuards(AdminAndTeacherGuard)
  async createTest(@Body() createData: TestDtoRequest) {
    try {
      const test = await this.testManagementService.addTest(createData);
      return new ResponseData<any>(test, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Put('test/update/:id')
  @UseGuards(AdminAndTeacherGuard)
  async editTest(@Param('id') id: number, @Body() updateData: TestDtoRequest) {
    try {
      const test = await this.testManagementService.updateTest(id, updateData);
      return new ResponseData<any>(test, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Delete('test/delete/:id')
  @UseGuards(AdminAndTeacherGuard)
  async deleteTest(@Param('id') id: number) {
    try {
      const test = await this.testManagementService.removeTest(id);
      return new ResponseData<any>(test, HttpMessage.SUCCESS, HttpStatus.SUCCESS);
    } catch (err) {
      return new ResponseData<any>(null, err, HttpStatus.ERROR);
    }
  }

  @Post('upload')
  // @UseGuards(AdminAndTeacherGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    console.log(file);
    try {
      if (req.fileValidationError) {
        throw new BadRequestException(req.fileValidationError);
      }

      if (!file) {
        throw new BadRequestException('File is required!');
      }
      const upload = await this.cloudinaryService.uploadFile(file);

      return new ResponseData<any>(
        { uploadedFile: upload.url },
        HttpMessage.SUCCESS,
        HttpStatus.SUCCESS
      );
    } catch (err) {
      throw new ResponseData<any>(null, err.message, HttpStatus.ERROR);
    }
  }
}
