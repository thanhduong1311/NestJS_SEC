import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { Course } from 'src/entities/course.entity';
import { CourseDtoRequest } from './dto/CourseDto';

@Injectable()
export class CourseService {
  constructor(@InjectRepository(Course) private courseRepository: Repository<Course>) {}

  async findAll() {
    const courses = await this.courseRepository.find();
    return courses.filter(item => item.deleteAt == null);
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

    if (!foundInfo)
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
