import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillDtoRequest } from './dto/SkillDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { Skill } from 'src/entities/skill.entity';

@Injectable()
export class SkillService {
  constructor(@InjectRepository(Skill) private skillRepository: Repository<Skill>) {}

  async findAll() {
    const skills = await this.skillRepository.find();
    return skills.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.skillRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found skill with id ' + id, HttpStatus.ERROR);
    return this.skillRepository.findOneBy({ id });
  }

  add(createData: SkillDtoRequest) {
    const newSkill = this.skillRepository.create({
      skillName: createData.skillName,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.skillRepository.save(newSkill);
  }

  async update(id: number, updateData: SkillDtoRequest) {
    const foundInfo = await this.skillRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found skill with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      skillName: updateData.skillName,
      deleteAt: updateData.deleteAt
    };

    await this.skillRepository.update({ id }, newData);

    const updatedSkill = await this.skillRepository.findOneBy({ id });

    return updatedSkill;
  }

  async remove(id: number) {
    const foundInfo = await this.skillRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found skill with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.skillRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.skillRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting skill with id ' + id, 500);
    }

    return deletedData;
  }
}
