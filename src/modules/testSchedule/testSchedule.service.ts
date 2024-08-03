import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestScheduleDtoRequest } from './dto/TestScheduleDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { TestSchedule } from 'src/entities/testSchedule.entity';

@Injectable()
export class TestScheduleService {
  constructor(
    @InjectRepository(TestSchedule)
    private testScheduleRepository: Repository<TestSchedule>
  ) {}

  async findAll() {
    const testSchedules = await this.testScheduleRepository.find();
    return testSchedules.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.testScheduleRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found testSchedule with id ' + id,
        HttpStatus.ERROR
      );
    return this.testScheduleRepository.findOneBy({ id });
  }

  add(createData: TestScheduleDtoRequest) {
    const newTestSchedule = this.testScheduleRepository.create({
      startDate: createData.startDate,
      endDate: createData.endDate,
      class: createData.class,
      test: createData.class,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.testScheduleRepository.save(newTestSchedule);
  }

  async update(id: number, updateData: TestScheduleDtoRequest) {
    const foundInfo = await this.testScheduleRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found testSchedule with id ' + id,
        HttpStatus.ERROR
      );

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      startDate: updateData.startDate,
      endDate: updateData.endDate,
      class: updateData.class,
      test: updateData.class,
      deleteAt: updateData.deleteAt
    };

    await this.testScheduleRepository.update({ id }, newData);

    const updatedTestSchedule = await this.testScheduleRepository.findOneBy({
      id
    });

    return updatedTestSchedule;
  }

  async remove(id: number) {
    const foundInfo = await this.testScheduleRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found testSchedule with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.testScheduleRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.testScheduleRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting testSchedule with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
