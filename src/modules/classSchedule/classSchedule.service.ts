import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassScheduleDtoRequest } from './dto/ClassSchedule';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { ClassSchedule } from 'src/entities/classSchedule.entity';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private classScheduleRepository: Repository<ClassSchedule>
  ) {}

  async findAll() {
    const classSchedules = await this.classScheduleRepository.find();
    return classSchedules.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.classScheduleRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found classSchedule with id ' + id,
        HttpStatus.ERROR
      );
    return this.classScheduleRepository.findOneBy({ id });
  }

  add(createData: ClassScheduleDtoRequest) {
    const newClassSchedule = this.classScheduleRepository.create({
      course: createData.course,
      classes: createData.classes,
      sectionDate: createData.sectionDate,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.classScheduleRepository.save(newClassSchedule);
  }

  async update(id: number, updateData: ClassScheduleDtoRequest) {
    const foundInfo = await this.classScheduleRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found classSchedule with id ' + id,
        HttpStatus.ERROR
      );

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      course: updateData.course,
      classes: updateData.classes,
      sectionDate: updateData.sectionDate,
      deleteAt: updateData.deleteAt
    };

    await this.classScheduleRepository.update({ id }, newData);

    const updatedClassSchedule = await this.classScheduleRepository.findOneBy({
      id
    });

    return updatedClassSchedule;
  }

  async remove(id: number) {
    const foundInfo = await this.classScheduleRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found classSchedule with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.classScheduleRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.classScheduleRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting classSchedule with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
