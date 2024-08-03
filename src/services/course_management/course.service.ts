import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { Course } from 'src/entities/course.entity';
import { CourseDtoRequest, PaginationResponse } from './dto/CourseDto';

@Injectable()
export class CourseService {
  constructor(@InjectRepository(Course) private courseRepository: Repository<Course>) {}

  async findAll(pageSize: number, pageNumber: number) {
    const page = pageNumber;
    const size = pageSize;
    const offset = (page - 1) * size;

    const courses = await this.courseRepository.find({
      take: size,
      skip: offset
    });
    const result = courses.filter(item => item.deleteAt == null);

    const totalCount = await this.courseRepository.count();
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / size);

    const response: PaginationResponse = {
      pageData: result.filter(item => item != null),
      meta: {
        currentPage: Number(page),
        totalCount: totalCount,
        totalPages: totalPages,
        pageSize: Number(pageSize)
      }
    };
    return response;
  }

  public async findOne(id: number) {
    const foundInfo = await this.courseRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found course with id ' + id, HttpStatus.ERROR);
    return this.courseRepository.findOneBy({ id });
  }

  add(createData: CourseDtoRequest) {
    const newCourse = this.courseRepository.create({
      courseName: createData.courseName,
      description: createData.description,
      numberOfLesson: createData.numberOfLesson,
      startDate: createData.startDate,
      endDate: createData.endDate,
      createBy: createData.createBy,
      updateBy: createData.updateBy,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.courseRepository.save(newCourse);
  }

  async update(id: number, updateData: CourseDtoRequest) {
    const foundInfo = await this.courseRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found course with id ' + id, HttpStatus.ERROR);

    const newData = {
      description: updateData.description,
      numberOfLesson: updateData.numberOfLesson,
      startDate: updateData.startDate,
      endDate: updateData.endDate,
      createBy: updateData.createBy,
      updateBy: updateData.updateBy,
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      courseName: updateData.courseName,
      deleteAt: updateData.deleteAt
    };

    await this.courseRepository.update({ id }, newData);

    const updatedCourse = await this.courseRepository.findOneBy({ id });

    return updatedCourse;
  }

  async remove(id: number) {
    const foundInfo = await this.courseRepository.findOneBy({ id });

    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found course with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.courseRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.courseRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting course with id ' + id, 500);
    }

    return deletedData;
  }
}
