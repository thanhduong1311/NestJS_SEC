import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from 'src/global/globalEnum';
import { formatDate } from 'src/utils/dateFormat';
import { Repository } from 'typeorm';
import { ClassDtoRequest } from './dto/ClassDto';
import { Classes } from 'src/entities/classes.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Classes) private classesRepository: Repository<Classes>
  ) {}

  async findAll() {
    const classes = await this.classesRepository.find();
    return classes.filter(item => item.deleteAt == null);
  }

  async findOne(id: number) {
    const foundInfo = await this.classesRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found Class with id ' + id, HttpStatus.ERROR);
    return this.classesRepository.findOneBy({ id });
  }

  async add(createData: ClassDtoRequest) {
    const newRole = await this.classesRepository.create({
      className: createData.className,
      teacher: createData.teacher,
      course: createData.course,
      enrollerCount: createData.enrollerCount,
      createBy: createData.createBy,
      updateBy: createData.updateBy,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date())
    });

    return await this.classesRepository.save(newRole);
  }

  async update(id: number, updateData: ClassDtoRequest) {
    const foundInfo = await this.classesRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Class with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      className: updateData.className,
      teacher: updateData.teacher,
      course: updateData.course,
      enrollerCount: updateData.enrollerCount,
      createBy: updateData.createBy,
      updateBy: updateData.updateBy
    };

    await this.classesRepository.update({ id }, newData);

    const updatedClass = await this.classesRepository.findOneBy({ id });

    return updatedClass;
  }

  async remove(id: number) {
    const foundInfo = await this.classesRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Class with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.classesRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.classesRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting classes with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
