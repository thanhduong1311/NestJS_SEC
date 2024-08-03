import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from 'src/global/globalEnum';
import { formatDate } from 'src/utils/dateFormat';
import { Repository } from 'typeorm';
import {
  AddStudentsToClassDto,
  ClassDtoRequest,
  ClassDtoResponse,
  PaginationResponse
} from './dto/ClassDto';
import { Classes } from 'src/entities/classes.entity';
import { StudentInClass } from 'src/entities/studentInClass.entity';
import { Student } from 'src/entities/student.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classes) private classesRepository: Repository<Classes>,
    @InjectRepository(StudentInClass)
    private studentInClassRepository: Repository<StudentInClass>,
    @InjectRepository(Student) private studentRepository: Repository<Student>
  ) {}

  async findAll(pageSize: number, pageNumber: number) {
    const classes = await this.classesRepository.find({
      relations: ['teacher', 'course']
    });

    const page = pageNumber;
    const size = pageSize;
    const offset = (page - 1) * size;

    const result: ClassDtoResponse[] = classes.map(item => {
      return {
        id: item.id,
        className: item.className,
        teacher: item.teacher.name,
        course: item.course.courseName,
        enrollerCount: item.enrollerCount,
        createBy: item.createBy,
        updateBy: item.updateBy,
        createAt: item.createAt,
        updateAt: item.updateAt,
        deleteAt: item.deleteAt
      };
    });

    const totalCount = await this.classesRepository.count();
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / size);

    const response: PaginationResponse = {
      pageData: result.slice(offset, offset + size).filter(item => item != null),
      meta: {
        currentPage: Number(page),
        totalCount: totalCount,
        totalPages: totalPages,
        pageSize: Number(pageSize)
      }
    };
    return response;
  }

  async findOne(id: number): Promise<any> {
    // const foundInfo = await this.classesRepository.findOneBy({ id });
    const foundInfo = await this.classesRepository
      .createQueryBuilder('classes')
      .leftJoinAndSelect('classes.course', 'course')
      .leftJoinAndSelect('classes.teacher', 'teacher')
      .where('classes.id =:id', { id: id })
      .getOne();

    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found Class with id ' + id, HttpStatus.ERROR);

    const response = {
      id: foundInfo.id,
      courseID: foundInfo.course.id,
      courseName: foundInfo.course.courseName,
      numberOfSession: foundInfo.course.numberOfLesson,
      enrollerCount: foundInfo.enrollerCount,
      className: foundInfo.className,
      teacherID: foundInfo.teacher.id,
      teacherName: foundInfo.teacher.name,
      createBy: foundInfo.createBy,
      updateBy: foundInfo.updateBy,
      createAt: foundInfo.createAt,
      updateAt: foundInfo.updateAt
    };
    return response;
  }

  async add(createData: ClassDtoRequest) {
    const newClass = await this.classesRepository.create({
      className: createData.className,
      teacher: createData.teacher,
      course: createData.course,
      enrollerCount: createData.enrollerCount,
      createBy: createData.createBy,
      updateBy: createData.updateBy,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date())
    });

    return await this.classesRepository.save(newClass);
  }

  async update(id: number, updateData: ClassDtoRequest) {
    const foundInfo = await this.classesRepository.findOneBy({ id });

    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found Class with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      className: updateData.className,
      teacher: updateData.teacher,
      course: updateData.course,
      enrollerCount: updateData.enrollerCount,
      createBy: updateData.createBy,
      updateBy: updateData.updateBy
    };

    const updatedClass = await this.classesRepository.update({ id }, newData);

    return updatedClass;
  }

  async remove(id: number) {
    const foundInfo = await this.classesRepository.findOneBy({ id });

    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found Class with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.classesRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.classesRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting classes with id ' + id,
        500
      );
    }

    return deletedData;
  }

  async addStudentToClass(
    classID: number,
    studentsData: AddStudentsToClassDto
  ): Promise<any> {
    const newStudents = await Promise.all(
      studentsData.studentIds.map(
        async item => await this.studentRepository.findOneBy({ id: item })
      )
    );
    const _class = await this.classesRepository
      .createQueryBuilder('classes')
      .leftJoinAndSelect('classes.course', 'course')
      .where('classes.id =:id', { id: classID })
      .getOne();
    const numberOfNewStudent = studentsData.studentIds.length;

    await this.classesRepository
      .createQueryBuilder()
      .update(Classes)
      .set({ enrollerCount: _class.enrollerCount + numberOfNewStudent })
      .where({ id: classID })
      .execute();

    const insertQuery = await Promise.all(
      newStudents.map(async item => {
        const newRow = {
          student: item,
          classes: _class,
          createAt: formatDate(new Date()),
          updateAt: formatDate(new Date()),
          deleteAt: null
        };
        return await this.studentInClassRepository.save(newRow);
      })
    );

    return {
      classID: classID,
      students: insertQuery.map(item => ({
        studentId: item.student.id,
        studentName: item.student.name
      }))
    };
  }

  async deleteStudentFromClass(
    classID: number,
    studentsData: AddStudentsToClassDto
  ): Promise<any> {
    const deleteQuery = await Promise.all(
      studentsData.studentIds.map(async item => {
        await this.studentInClassRepository
          .createQueryBuilder('studentInClass')
          .update(StudentInClass)
          .set({ deleteAt: formatDate(new Date()) })
          .where('classesId = :id and studentInClass.studentId = :studentID ', {
            id: classID,
            studentID: item
          })
          .execute();
      })
    );

    return deleteQuery;
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
          name: item.student.name
        };
    });

    return response.filter(item => item != null);
  }

  async getStudentNotInClass(classID: number): Promise<any> {
    const currentClass = await this.studentInClassRepository
      .createQueryBuilder('studentInClass')
      .leftJoinAndSelect('studentInClass.student', 'student')
      .where('studentInClass.classes= :id', {
        id: classID
      })
      .andWhere('studentInClass.deleteAt IS NULL')
      .getMany();

    const currentClassStudent = currentClass.map(item => item.student.id);

    const students = await this.studentRepository.find();
    const allStudentIDs = students.map(item => item.id);
    const distinctStudents: number[] = [];

    allStudentIDs.forEach(item => {
      if (!distinctStudents.includes(item) && !currentClassStudent.includes(item))
        distinctStudents.push(item);
    });

    const response = await Promise.all(
      distinctStudents.map(
        async item => await this.studentRepository.findOneBy({ id: item })
      )
    );

    return response.map(item => ({
      id: item.id,
      name: item.name
    }));
  }
}
