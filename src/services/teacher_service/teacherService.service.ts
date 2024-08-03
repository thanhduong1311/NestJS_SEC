import { Injectable } from '@nestjs/common';
import {
  CreateScheduleRequest,
  CreateTestScheduleRequest,
  EditAttendanceDto,
  TakeAttendanceDto,
  ViewAttendanceDto
} from './dto/teacherServiceDto';
import { ClassSchedule } from 'src/entities/classSchedule.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate } from 'src/utils/dateFormat';
import { Classes } from 'src/entities/classes.entity';
import { TestSchedule } from 'src/entities/testSchedule.entity';
import { Test } from 'src/entities/test.entity';
import { StudentInClass } from 'src/entities/studentInClass.entity';
import { Attendance } from 'src/entities/atttendance.entity';
import { Student } from 'src/entities/student.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(ClassSchedule)
    private classScheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(TestSchedule)
    private testScheduleRepository: Repository<TestSchedule>,
    @InjectRepository(Classes)
    private classRepository: Repository<Classes>,
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
    @InjectRepository(StudentInClass)
    private studentInClassRepository: Repository<StudentInClass>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>
  ) {}

  async createClassSchedule(createData: CreateScheduleRequest): Promise<any> {
    const classInfo = await this.classRepository
      .createQueryBuilder('classes')
      .leftJoinAndSelect('classes.course', 'course')
      .where('classes.id =:id', { id: createData.classID })
      .getOne();

    const createdRecords = await Promise.all(
      createData.sectionDate.map(async item => {
        const newRecord = await this.classScheduleRepository.create({
          sectionDate: item,
          course: classInfo.course,
          classes: classInfo,
          createAt: formatDate(new Date()),
          updateAt: formatDate(new Date()),
          deleteAt: null
        });
        return await this.classScheduleRepository.save(newRecord);
      })
    );

    const sections = createdRecords.map(record => record.sectionDate);
    return {
      classId: classInfo.id,
      courseId: classInfo.course.id,
      sections
    };
  }

  async updateClassSchedule(createData: CreateScheduleRequest): Promise<any> {
    const classInfo = await this.classRepository
      .createQueryBuilder('classes')
      .leftJoinAndSelect('classes.course', 'course')
      .where('classes.id =:id', { id: createData.classID })
      .getOne();

    await this.classRepository
      .createQueryBuilder('classesSchedule')
      .delete()
      .from(ClassSchedule)
      .where('classes =:id', { id: createData.classID })
      .andWhere('course =:id', { id: classInfo.course.id })
      .execute();

    const createdRecords = await Promise.all(
      createData.sectionDate.map(async item => {
        const newRecord = await this.classScheduleRepository.create({
          sectionDate: item,
          course: classInfo.course,
          classes: classInfo,
          createAt: formatDate(new Date()),
          updateAt: formatDate(new Date()),
          deleteAt: null
        });
        return await this.classScheduleRepository.save(newRecord);
      })
    );

    const sections = createdRecords.map(record => record.sectionDate);
    return {
      classId: classInfo.id,
      courseId: classInfo.course.id,
      sections
    };
  }

  async createTestSchedule(createData: CreateTestScheduleRequest): Promise<any> {
    const classInfo = await this.classRepository.findOneBy({ id: createData.classID });
    const testInfo = await this.testRepository.findOneBy({ id: createData.testID });

    const newRecord = await this.testScheduleRepository.create({
      startDate: createData.startDate,
      endDate: createData.endDate,
      class: classInfo,
      test: testInfo,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return await this.testScheduleRepository.save(newRecord);
  }

  async updateTestSchedule(createData: CreateTestScheduleRequest): Promise<any> {
    const classInfo = await this.classRepository.findOneBy({ id: createData.classID });
    const testInfo = await this.testRepository.findOneBy({ id: createData.testID });

    const deleteQuery = await this.testScheduleRepository
      .createQueryBuilder('testSchedule')
      .delete()
      .from(TestSchedule)
      .where('class =:classId', { classId: createData.classID })
      .andWhere('test =:testId', { testId: createData.testID })
      .execute();

    if (deleteQuery) {
      const newRecord = await this.testScheduleRepository.create({
        startDate: createData.startDate,
        endDate: createData.endDate,
        class: classInfo,
        test: testInfo,
        createAt: formatDate(new Date()),
        updateAt: formatDate(new Date()),
        deleteAt: null
      });
      return await this.testScheduleRepository.save(newRecord);
    }
  }

  async classAllClassSchedule(teacherID: number): Promise<any> {
    const query = await this.classScheduleRepository
      .createQueryBuilder('classschedule')
      .leftJoinAndSelect('classschedule.classes', 'classes')
      .where('classes.teacherId =:id', { id: teacherID })
      .getMany();

    const response = query.map(item => ({
      id: item.id,
      sectionDate: item.sectionDate,
      classId: item.classes.id,
      className: item.classes.className
    }));

    return response;
  }

  async getStudentInClass(classID: number): Promise<any> {
    const query = await this.studentInClassRepository
      .createQueryBuilder('studentInClass')
      .leftJoinAndSelect('studentInClass.classes', 'classes')
      .leftJoinAndSelect('studentInClass.student', 'student')
      .where('classes.id = :id ', { id: classID })
      .getMany();

    const response = query.map(item => {
      if (item.deleteAt == null)
        return {
          id: item.student.id,
          name: item.student.name,
          avatar: item.student.avatar
        };
    });

    return response.filter(item => item != null);
  }

  async takeAttendance(attendanceData: TakeAttendanceDto): Promise<any> {
    const _class = await this.classRepository.findOneBy({ id: attendanceData.classID });

    const response = Promise.all(
      attendanceData.students.map(async item => {
        const student = await this.studentRepository.findOneBy({ id: item.studentID });

        const newData = this.attendanceRepository.create({
          classes: _class,
          isAttended: item.isAttend,
          date: attendanceData.date,
          student: student,
          createAt: formatDate(new Date()),
          updateAt: formatDate(new Date()),
          deleteAt: null
        });

        return await this.attendanceRepository.save(newData);
      })
    );

    return response;
  }

  async getAttendance(attendanceData: ViewAttendanceDto): Promise<any> {
    console.log('%' + attendanceData.date + '%');
    const query = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.classes', 'classes')
      .leftJoinAndSelect('attendance.student', 'student')
      .where('classes.id =:id', { id: attendanceData.classID })
      .andWhere('attendance.date like :targetDate', {
        targetDate: '%' + attendanceData.date + '%'
      })
      .andWhere('attendance.deleteAt is null')
      .getMany();

    return {
      classID: attendanceData.classID,
      date: attendanceData.date,
      studentData: query.map(item => ({
        attendanceID: item.id,
        studentID: item.student.id,
        studentName: item.student.name,
        studentAvatar: item.student.avatar,
        isAttend: item.isAttended
      }))
    };
  }

  async editAttendance(attendanceData: EditAttendanceDto): Promise<any> {
    const response = Promise.all(
      attendanceData.students.map(async item => {
        return await this.attendanceRepository
          .createQueryBuilder('attendance')
          .update(Attendance)
          .set({ isAttended: item.isAttend, updateAt: formatDate(new Date()) })
          .where('attendance.id = :id', {
            id: item.attendanceId
          })
          .execute();
      })
    );

    return response;
  }
}
