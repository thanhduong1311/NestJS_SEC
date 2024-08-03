import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionType } from 'src/entities/questionType.entity';
import { Repository } from 'typeorm';
import { QuestionTypeDtoRequest } from './dto/questionTypeDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';

@Injectable()
export class QuestionTypeService {
  constructor(
    @InjectRepository(QuestionType)
    private questionTypeRepository: Repository<QuestionType>
  ) {}

  async findAll() {
    const questionTypes = await this.questionTypeRepository.find();
    return questionTypes.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.questionTypeRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found questionType with id ' + id,
        HttpStatus.ERROR
      );
    return this.questionTypeRepository.findOneBy({ id });
  }

  add(createData: QuestionTypeDtoRequest) {
    const newQuestionType = this.questionTypeRepository.create({
      typeName: createData.typeName,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.questionTypeRepository.save(newQuestionType);
  }

  async update(id: number, updateData: QuestionTypeDtoRequest) {
    const foundInfo = await this.questionTypeRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found questionType with id ' + id,
        HttpStatus.ERROR
      );

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      typeName: updateData.typeName,
      deleteAt: updateData.deleteAt
    };

    await this.questionTypeRepository.update({ id }, newData);

    const updatedQuestionType = await this.questionTypeRepository.findOneBy({
      id
    });

    return updatedQuestionType;
  }

  async remove(id: number) {
    const foundInfo = await this.questionTypeRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found questionType with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.questionTypeRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.questionTypeRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting questionType with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
