import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceDtoRequest } from './dto/AttendanceDto';
import { formatDate } from 'src/utils/dateFormat';
import { HttpStatus } from 'src/global/globalEnum';
import { Attendance } from 'src/entities/atttendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>
  ) {}

  async findAll() {
    const attendances = await this.attendanceRepository.find();
    return attendances.filter(item => item.deleteAt == null);
  }

  public async findOne(id: number) {
    const foundInfo = await this.attendanceRepository.findOneBy({ id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found attendance with id ' + id, HttpStatus.ERROR);
    return this.attendanceRepository.findOneBy({ id });
  }

  add(createData: AttendanceDtoRequest) {
    const newAttendance = this.attendanceRepository.create({
      classes: createData.classes,
      student: createData.student,
      date: createData.date,
      isAttended: createData.isAttended,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date()),
      deleteAt: null
    });
    return this.attendanceRepository.save(newAttendance);
  }

  async update(id: number, updateData: AttendanceDtoRequest) {
    const foundInfo = await this.attendanceRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found attendance with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      classes: updateData.classes,
      student: updateData.student,
      date: updateData.date,
      isAttended: updateData.isAttended,
      deleteAt: updateData.deleteAt
    };

    await this.attendanceRepository.update({ id }, newData);

    const updatedAttendance = await this.attendanceRepository.findOneBy({ id });

    return updatedAttendance;
  }

  async remove(id: number) {
    const foundInfo = await this.attendanceRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found attendance with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.attendanceRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.attendanceRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting attendance with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
