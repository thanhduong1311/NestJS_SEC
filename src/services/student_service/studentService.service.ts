import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassSchedule } from 'src/entities/classSchedule.entity';
import { Student } from 'src/entities/student.entity';
import { StudentInClass } from 'src/entities/studentInClass.entity';
import { Repository } from 'typeorm';
import {
  PaginationResponse,
  SectionDayDto,
  SettingDto,
  TestDateDto,
  UpdateProfileRequestDto
} from './dto/studentServiceDto';
import { Attendance } from 'src/entities/atttendance.entity';
import { TestSchedule } from 'src/entities/testSchedule.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Admin } from 'src/entities/admin.entity';
import { TestQuestion } from 'src/entities/testQuestion.entity';
import { AnswerBank } from 'src/entities/answerBank.entity';

interface Answer {
  answerId: number;
  answerContent: string;
}

interface PartWithQuestions {
  partData: string;
  partDescription: string;
  partFile: string | null; // Allow for optional part file
  question: Question[];
}

type Question = {
  questionId: number;
  questionType: string;
  questionContent: string;
  answers: Answer[];
};

type testTemplate = {
  testId: number;
  testName: string;
  testType: string;
  testTypeCode: string;
  totalQuestion: number;
  details: Record<string, Record<string, PartWithQuestions>>;
};

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(StudentInClass)
    private studentInClassRepository: Repository<StudentInClass>,
    @InjectRepository(ClassSchedule)
    private classScheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(TestSchedule)
    private testScheduleRepository: Repository<TestSchedule>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(TestQuestion)
    private testQuestionRepository: Repository<TestQuestion>,
    @InjectRepository(AnswerBank)
    private answerBankRepository: Repository<AnswerBank>
  ) {}

  async getClassByUsername(username: string): Promise<any> {
    const query = await this.studentInClassRepository
      .createQueryBuilder('studentinclass')
      .leftJoinAndSelect('studentinclass.student', 'student')
      .leftJoinAndSelect('studentinclass.classes', 'classes')
      .where('student.username  =:username', { username: username })
      .getMany();

    const response = query.map(item => ({
      classID: item.classes.id,
      className: item.classes.className
    }));

    return response;
  }

  async getScheduleByClass(classID: number): Promise<any> {
    const query = await this.classScheduleRepository
      .createQueryBuilder('classschedule')
      .leftJoinAndSelect('classschedule.classes', 'classes')
      .leftJoinAndSelect('classes.teacher', 'teacher')
      .where('classes.id  =:id', { id: classID })
      .getMany();

    const response: SectionDayDto[] = query.map(item => ({
      id: item.id,
      sectionDate: item.sectionDate,
      classId: item.classes.id,
      className: item.classes.className,
      teacherId: item.classes.teacher.id,
      teacherName: item.classes.teacher.name
    }));

    return response;
  }

  async getTestScheduleByClass(classID: number): Promise<any> {
    const query = await this.testScheduleRepository
      .createQueryBuilder('testSchedule')
      .leftJoinAndSelect('testSchedule.class', 'classes')
      .leftJoinAndSelect('testSchedule.test', 'test')
      .leftJoinAndSelect('test.type', 'typeOfTest')
      .where('classes.id  =:id', { id: classID })
      .getMany();

    const response: TestDateDto[] = query.map(item => ({
      id: item.id,
      classId: item.class.id,
      className: item.class.className,
      startDate: item.startDate,
      endDate: item.endDate,
      totalTime: item.test.totalTime,
      testID: item.test.id,
      type: item.test.type.typeName
    }));

    return response;
  }

  async getPracticesExam(username: string): Promise<any> {
    const enrollClass = await this.studentInClassRepository
      .createQueryBuilder('studentInClass')
      .leftJoinAndSelect('studentInClass.student', 'student')
      .leftJoinAndSelect('studentInClass.classes', 'classes')
      .where('student.username LIKE :username', { username })
      .getMany();

    const practiceTests = await Promise.all(
      enrollClass.map(async item => {
        const query = await this.testScheduleRepository
          .createQueryBuilder('testSchedule')
          .leftJoinAndSelect('testSchedule.class', 'classes')
          .leftJoinAndSelect('testSchedule.test', 'test')
          .leftJoinAndSelect('test.type', 'typeOfTest')
          .where('classes.id  =:id', { id: item.classes.id })
          .andWhere('typeOfTest.code like :code', { code: 'PRAC' })
          .getMany();

        return query.map(item => ({
          id: item.id,
          classId: item.class.id,
          className: item.class.className,
          startDate: item.startDate,
          endDate: item.endDate,
          totalTime: item.test.totalTime,
          testID: item.test.id,
          type: item.test.type.typeName
        }));
      })
    );

    return [...practiceTests.flat()];
  }

  async getAttendance(
    username: string,
    classID: string,
    pageSize: number = 40,
    pageNumber: number = 1
  ): Promise<PaginationResponse | null> {
    const result = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.classes', 'classes')
      .leftJoinAndSelect('classes.course', 'course')
      .leftJoinAndSelect('attendance.student', 'student')
      .leftJoinAndSelect('classes.teacher', 'teacher')
      .where('student.username = :username', { username })
      .andWhere('classes.id = :classID', { classID })
      .orderBy('attendance.date', 'DESC')
      .getMany();

    if (result.length === 0) {
      return null;
    }

    const completedLesson = result.length;
    const numberOfAbsent = result.filter(item => !item.isAttended).length;
    const totalLesson = result[0].classes.course.numberOfLesson;

    const absentPercent = Math.round((numberOfAbsent / completedLesson) * 100);
    const presentPercent = 100 - absentPercent;
    const completePercent = Math.round((completedLesson / totalLesson) * 100);

    const offset = (pageNumber - 1) * pageSize;
    const paginatedResult = result.slice(offset, offset + pageSize);

    const response = {
      totalLesson,
      completedPercent: completePercent,
      presentPercent,
      absentPercent,
      detail: paginatedResult.map(item => ({
        id: item.id,
        date: item.date,
        isAttended: item.isAttended,
        teacher: item.classes.teacher.name
      }))
    };

    const totalPages = Math.ceil(completedLesson / pageSize);

    const responsePagination: PaginationResponse = {
      pageData: response,
      meta: {
        currentPage: Number(pageNumber),
        totalCount: completedLesson,
        totalPages,
        pageSize: Number(pageSize)
      }
    };

    return responsePagination;
  }

  async uploadAvatar(id: number, avatar: string): Promise<any> {
    return await this.studentRepository.update(id, { avatar });
  }

  async updateProfile(
    username: string,
    profileInfo: UpdateProfileRequestDto
  ): Promise<any> {
    const check = await this.checkForUpdate(username, profileInfo);

    if (check) {
      const response = await this.studentRepository.update(
        { username: username },
        {
          ...profileInfo
        }
      );
      return response;
    }

    throw new HttpException('Unexpected error', 400);
  }

  async updateSettings(username: string, settings: SettingDto): Promise<any> {
    return await this.studentRepository.update({ username }, { ...settings });
  }

  async checkForUpdate(
    username: string,
    profileInfo: UpdateProfileRequestDto
  ): Promise<boolean> {
    const check = true;

    let userInfo =
      (await this.studentRepository.findOneBy({ email: profileInfo.email })) ||
      (await this.adminRepository.findOneBy({ email: profileInfo.email })) ||
      (await this.teacherRepository.findOneBy({ email: profileInfo.email }));
    if (userInfo) {
      if (userInfo.username != username)
        throw new HttpException('Email is early in use', 400);
    }

    userInfo =
      (await this.studentRepository.findOneBy({ phone: profileInfo.phone })) ||
      (await this.teacherRepository.findOneBy({ phone: profileInfo.phone }));
    if (userInfo) {
      if (userInfo.username != username)
        throw new HttpException('Phone is early in use', 400);
    }
    console.log(userInfo);

    return check;
  }
  async getTestPaper(testID: number): Promise<testTemplate | null> {
    const query = await this.testQuestionRepository
      .createQueryBuilder('testQuestion')
      .leftJoinAndSelect('testQuestion.test', 'test')
      .leftJoinAndSelect('test.type', 'type')
      .leftJoinAndSelect('testQuestion.question', 'question')
      .leftJoinAndSelect('question.questionType', 'questionType')
      .leftJoinAndSelect('testQuestion.part', 'part')
      .leftJoinAndSelect('part.skill', 'skill')
      .where('test.id =:testID', { testID })
      .andWhere('testQuestion.deleteAt IS NULL')
      .getMany();

    if (query.length === 0) {
      return null;
    }

    const result: testTemplate = {
      testId: query[0].test.id,
      testName: query[0].test.testName,
      testType: query[0].test.type.typeName,
      testTypeCode: query[0].test.type.code,
      totalQuestion: query.length,
      details: {}
    };

    const skillMap: Record<string, { part: Record<string, PartWithQuestions> }> = {};
    for (const item of query) {
      const skillName = item.part.skill.code;
      const partID = item.part.id;

      if (!skillMap[skillName]) {
        skillMap[skillName] = { part: {} };
      }

      if (!skillMap[skillName].part[partID]) {
        skillMap[skillName].part[partID] = {
          partData: item.part.data,
          partDescription: item.part.description,
          partFile: item.part.file,
          question: []
        };
      }

      skillMap[skillName].part[partID].question.push({
        questionId: item.question.id,
        questionType: item.question.questionType.code,
        questionContent: item.question.content,
        answers: await this.getAnswersForQuestion(item.question.id)
      });
    }

    for (const [skillName, skillDetails] of Object.entries(skillMap)) {
      result.details[skillName] = skillDetails.part;
    }

    return result;
  }

  async getAnswersForQuestion(questionId: number): Promise<Answer[]> {
    const answers = await this.answerBankRepository
      .createQueryBuilder('answerBank')
      .leftJoinAndSelect('answerBank.question', 'question')
      .where('question.id =:id', { id: questionId })
      .getMany();

    return answers.map(item => ({
      answerId: item.id,
      answerContent: item.content
    }));
  }

  async viewATest(testID: number): Promise<any> {
    const query = await this.testQuestionRepository
      .createQueryBuilder('testQuestion')
      .leftJoinAndSelect('testQuestion.test', 'test')
      .leftJoinAndSelect('test.type', 'type')
      .leftJoinAndSelect('testQuestion.question', 'question')
      .leftJoinAndSelect('question.questionType', 'questionType')
      .leftJoinAndSelect('testQuestion.part', 'part')
      .leftJoinAndSelect('part.skill', 'skill')
      .where('test.id =:id', { id: testID })
      .andWhere('testQuestion.deleteAt IS NULL')
      .getMany();

    const result: Record<string, Record<string, any>> = {};

    query.forEach(item => {
      const skillName = item.part.skill.code;
      const partID = item.part.id;
      const questionId = item.question.id;
      const questionContent = item.question.content;
      const questionType = item.question.questionType.code;
      const partData = item.part.data;
      const partDescription = item.part.description;

      if (!result[skillName]) {
        result[skillName] = {};
      }

      if (!result[skillName]['part']) {
        result[skillName]['part'] = {
          partData,
          partDescription
        };
      }

      if (!result[skillName]['part'][partID]) {
        result[skillName]['part'][partID] = { question: [] };
      }

      result[skillName]['part'][partID]['question'].push({
        questionId,
        questionContent,
        questionType
      });
    });

    return query.length != 0
      ? {
          testId: query[0].test.id,
          testName: query[0].test.testName,
          testType: query[0].test.type.typeName,
          testTypeCode: query[0].test.type.code,
          totalQuestion: query.length,
          details: result
        }
      : null;
  }
}
