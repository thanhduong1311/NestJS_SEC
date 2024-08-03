import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOfTestDtoRequest } from './dto/TypeOfTestDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { TypeOfTest } from 'src/entities/typeOfTest.entity';

@Injectable()
export class TypeOfTestService {
  constructor(
    @InjectRepository(TypeOfTest)
    private typeRepository: Repository<TypeOfTest>
  ) {}

  async findAll() {
    const types = await this.typeRepository.find();
    return types.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.typeRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found type with id ' + id, HttpStatus.ERROR);
    return this.typeRepository.findOneBy({ id });
  }

  add(createData: TypeOfTestDtoRequest) {
    const newTypeOfTest = this.typeRepository.create({
      typeName: createData.typeName,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.typeRepository.save(newTypeOfTest);
  }

  async update(id: number, updateData: TypeOfTestDtoRequest) {
    const foundInfo = await this.typeRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found type with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      typeName: updateData.typeName,
      deleteAt: updateData.deleteAt
    };

    await this.typeRepository.update({ id }, newData);

    const updatedTypeOfTest = await this.typeRepository.findOneBy({ id });

    return updatedTypeOfTest;
  }

  async remove(id: number) {
    const foundInfo = await this.typeRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found type with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.typeRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.typeRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting type with id ' + id, 500);
    }

    return deletedData;
  }
}
