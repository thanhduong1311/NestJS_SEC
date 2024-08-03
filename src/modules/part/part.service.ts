import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartDtoRequest } from './dto/PartDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { Part } from 'src/entities/part.entity';

@Injectable()
export class PartService {
  constructor(@InjectRepository(Part) private partRepository: Repository<Part>) {}

  async findAll() {
    const parts = await this.partRepository.find();
    return parts.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.partRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found part with id ' + id, HttpStatus.ERROR);
    return this.partRepository.findOneBy({ id });
  }

  add(createData: PartDtoRequest) {
    const newPart = this.partRepository.create({
      partName: createData.partName,
      data: createData.data,
      index: createData.index,
      description: createData.description,
      skill: createData.skill,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.partRepository.save(newPart);
  }

  async update(id: number, updateData: PartDtoRequest) {
    const foundInfo = await this.partRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found part with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      partName: updateData.partName,
      data: updateData.data,
      index: updateData.index,
      description: updateData.description,
      skill: updateData.skill,
      deleteAt: updateData.deleteAt
    };

    await this.partRepository.update({ id }, newData);

    const updatedPart = await this.partRepository.findOneBy({ id });

    return updatedPart;
  }

  async remove(id: number) {
    const foundInfo = await this.partRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found part with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.partRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.partRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting part with id ' + id, 500);
    }

    return deletedData;
  }
}
