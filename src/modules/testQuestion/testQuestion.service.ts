import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestQuestionDtoRequest } from './dto/TestQuestion';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { TestQuestion } from 'src/entities/testQuestion.entity';

@Injectable()
export class TestQuestionService {
  constructor(
    @InjectRepository(TestQuestion)
    private testQuestionRepository: Repository<TestQuestion>
  ) {}

  async findAll() {
    const testQuestions = await this.testQuestionRepository.find();
    return testQuestions.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.testQuestionRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found testQuestion with id ' + id,
        HttpStatus.ERROR
      );
    return this.testQuestionRepository.findOneBy({ id });
  }

  add(createData: TestQuestionDtoRequest) {
    const newTestQuestion = this.testQuestionRepository.create({
      test: createData.test,
      type: createData.type,
      question: createData.question,
      part: createData.part,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.testQuestionRepository.save(newTestQuestion);
  }

  async update(id: number, updateData: TestQuestionDtoRequest) {
    const foundInfo = await this.testQuestionRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found testQuestion with id ' + id,
        HttpStatus.ERROR
      );

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      test: updateData.test,
      type: updateData.type,
      part: updateData.part,
      question: updateData.question,
      deleteAt: updateData.deleteAt
    };

    await this.testQuestionRepository.update({ id }, newData);

    const updatedTestQuestion = await this.testQuestionRepository.findOneBy({
      id
    });

    return updatedTestQuestion;
  }

  async remove(id: number) {
    const foundInfo = await this.testQuestionRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found testQuestion with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.testQuestionRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.testQuestionRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting testQuestion with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
