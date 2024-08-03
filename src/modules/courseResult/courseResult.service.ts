import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseResultDtoRequest } from './dto/CourseResultDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { CourseResult } from 'src/entities/courseResult.entity';

@Injectable()
export class CourseResultService {
  constructor(
    @InjectRepository(CourseResult)
    private CourseResultRepository: Repository<CourseResult>
  ) {}

  async findAll() {
    const CourseResults = await this.CourseResultRepository.find();
    return CourseResults.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.CourseResultRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found CourseResult with id ' + id,
        HttpStatus.ERROR
      );
    return this.CourseResultRepository.findOneBy({ id });
  }

  add(createData: CourseResultDtoRequest) {
    const newCourseResult = this.CourseResultRepository.create({
      course: createData.course,
      student: createData.student,
      result: createData.result,
      mark: createData.mark,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.CourseResultRepository.save(newCourseResult);
  }

  async update(id: number, updateData: CourseResultDtoRequest) {
    const foundInfo = await this.CourseResultRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found CourseResult with id ' + id,
        HttpStatus.ERROR
      );

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      course: updateData.course,
      student: updateData.student,
      result: updateData.result,
      mark: updateData.mark,
      deleteAt: updateData.deleteAt
    };

    await this.CourseResultRepository.update({ id }, newData);

    const updatedCourseResult = await this.CourseResultRepository.findOneBy({
      id
    });

    return updatedCourseResult;
  }

  async remove(id: number) {
    const foundInfo = await this.CourseResultRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found CourseResult with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.CourseResultRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.CourseResultRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting CourseResult with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
