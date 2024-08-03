import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestDtoRequest } from './dto/TestDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { Test } from 'src/entities/test.entity';

@Injectable()
export class TestService {
  constructor(@InjectRepository(Test) private testRepository: Repository<Test>) {}

  async findAll() {
    const tests = await this.testRepository.find();
    return tests.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.testRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found test with id ' + id, HttpStatus.ERROR);
    return this.testRepository.findOneBy({ id });
  }

  add(createData: TestDtoRequest) {
    const newTest = this.testRepository.create({
      testName: createData.testName,
      type: createData.type,
      createBy: createData.createBy,
      updateBy: createData.updateBy,
      totalTime: createData.totalTime,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.testRepository.save(newTest);
  }

  async update(id: number, updateData: TestDtoRequest) {
    const foundInfo = await this.testRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found test with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      testName: updateData.testName,
      type: updateData.type,
      createBy: updateData.createBy,
      updateBy: updateData.updateBy,
      totalTime: updateData.totalTime,
      deleteAt: updateData.deleteAt
    };

    await this.testRepository.update({ id }, newData);

    const updatedTest = await this.testRepository.findOneBy({ id });

    return updatedTest;
  }

  async remove(id: number) {
    const foundInfo = await this.testRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found test with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.testRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.testRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting test with id ' + id, 500);
    }

    return deletedData;
  }
}
