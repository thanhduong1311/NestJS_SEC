import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentInClassDtoRequest } from './dto/StudentInClassDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { StudentInClass } from 'src/entities/studentInClass.entity';

@Injectable()
export class StudentInClassService {
  constructor(
    @InjectRepository(StudentInClass)
    private skillRepository: Repository<StudentInClass>
  ) {}

  async findAll() {
    const skills = await this.skillRepository.find();
    return skills.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.skillRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException(
        'Cannot found studentInClass with id ' + id,
        HttpStatus.ERROR
      );
    return this.skillRepository.findOneBy({ id });
  }

  add(createData: StudentInClassDtoRequest) {
    const newStudentInClass = this.skillRepository.create({
      student: createData.student,
      classes: createData.classes,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.skillRepository.save(newStudentInClass);
  }

  async update(id: number, updateData: StudentInClassDtoRequest) {
    const foundInfo = await this.skillRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found studentInClass with id ' + id,
        HttpStatus.ERROR
      );

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      student: updateData.student,
      classes: updateData.classes,
      deleteAt: updateData.deleteAt
    };

    await this.skillRepository.update({ id }, newData);

    const updatedStudentInClass = await this.skillRepository.findOneBy({ id });

    return updatedStudentInClass;
  }

  async remove(id: number) {
    const foundInfo = await this.skillRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException(
        'Cannot found studentInClass with id ' + id,
        HttpStatus.ERROR
      );

    foundInfo.deleteAt = formatDate(new Date());

    await this.skillRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.skillRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting studentInClass with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
