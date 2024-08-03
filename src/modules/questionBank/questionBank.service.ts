import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionBank } from 'src/entities/questionBank.entity';
import { Repository } from 'typeorm';
import { QuestionBankDtoRequest } from './dto/QuestionBank';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';

@Injectable()
export class QuestionBankService {
  constructor(
    @InjectRepository(QuestionBank)
    private questionBankRepository: Repository<QuestionBank>
  ) {}

  async findAll() {
    const questionBanks = await this.questionBankRepository.find();
    return questionBanks.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.questionBankRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found questionBank with id ' + id,
        HttpStatus.ERROR
      );
    return this.questionBankRepository.findOneBy({ id });
  }

  add(createData: QuestionBankDtoRequest) {
    const newQuestionBank = this.questionBankRepository.create({
      content: createData.content,
      questionType: createData.questionType,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.questionBankRepository.save(newQuestionBank);
  }

  async update(id: number, updateData: QuestionBankDtoRequest) {
    const foundInfo = await this.questionBankRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found questionBank with id ' + id,
        HttpStatus.ERROR
      );

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      content: updateData.content,
      questionType: updateData.questionType,
      deleteAt: updateData.deleteAt
    };

    await this.questionBankRepository.update({ id }, newData);

    const updatedQuestionBank = await this.questionBankRepository.findOneBy({
      id
    });

    return updatedQuestionBank;
  }

  async remove(id: number) {
    const foundInfo = await this.questionBankRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found questionBank with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.questionBankRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.questionBankRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting questionBank with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
