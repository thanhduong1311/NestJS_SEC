import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from 'src/global/globalEnum';
import { formatDate } from 'src/utils/dateFormat';
import { Repository } from 'typeorm';
import { StudentDtoRequest, StudentDtoResponse } from './dto/StudentDto';
import { Student } from 'src/entities/student.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>
  ) {}

  async findAll() {
    const students = await this.studentRepository.find();
    const response: StudentDtoResponse[] = [];

    const student = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.role', 'role')
      .getOne();

    students.forEach((item: Student) => {
      if (item.deleteAt == null) {
        const newInfo: StudentDtoResponse = {
          id: item.id,
          role: student.role.roleName,
          name: item.name,
          email: item.email,
          username: item.username,
          password: item.password,
          phone: item.phone,
          status: item.status,
          avatar: item.avatar,
          language: item.language,
          theme: item.theme,
          createAt: item.createAt,
          updateAt: item.updateAt
        };

        response.push(newInfo);
      }
    });

    return response;
  }

  async findOneByID(id: number) {
    const foundInfo = await this.studentRepository.findOneBy({ id });

    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found Student with id ' + id, HttpStatus.ERROR);
    const student = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.role', 'role')
      .where('student.id = :id', { id: id })
      .getOne();

    const newInfo: StudentDtoResponse = {
      id: student.id,
      role: student.role.roleName,
      name: student.name,
      email: student.email,
      username: student.username,
      password: student.password,
      phone: student.phone,
      status: student.status,
      avatar: student.avatar,
      language: student.language,
      theme: student.theme,
      createAt: student.createAt,
      updateAt: student.updateAt
    };
    return newInfo;
  }

  async findOneByUsername(username: string) {
    const foundInfo = await this.studentRepository.findOneBy({
      username: username
    });
    if (!foundInfo || foundInfo.deleteAt != null) return undefined;

    const student = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.role', 'role')
      .where('student.username = :username', { username: username })
      .getOne();

    const newInfo: StudentDtoResponse = {
      id: student.id,
      role: student.role.roleName,
      name: student.name,
      email: student.email,
      username: student.username,
      password: student.password,
      phone: student.phone,
      status: student.status,
      avatar: student.avatar,
      language: student.language,
      theme: student.theme,
      createAt: student.createAt,
      updateAt: student.updateAt
    };
    return newInfo;
  }

  async findOneByEmail(email: string) {
    const foundInfo = await this.studentRepository.findOneBy({
      email: email
    });
    if (!foundInfo || foundInfo.deleteAt != null) return undefined;

    const student = await this.studentRepository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.role', 'role')
      .where('student.email = :email', { email: email })
      .getOne();

    const newInfo: StudentDtoResponse = {
      id: student.id,
      role: student.role.roleName,
      name: student.name,
      email: student.email,
      username: student.username,
      password: student.password,
      phone: student.phone,
      status: student.status,
      avatar: student.avatar,
      language: student.language,
      theme: student.theme,
      createAt: student.createAt,
      updateAt: student.updateAt
    };
    return newInfo;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async changePassword(usernameOrEmail: string, newPass: string): Promise<any> {
    try {
      const foundInfo = await this.studentRepository.findOneBy({
        username: usernameOrEmail
      });

      if (foundInfo) {
        const updated = this.studentRepository.update(
          { username: usernameOrEmail },
          {
            ...foundInfo,
            password: await this.hashPassword(newPass),
            updateAt: formatDate(new Date())
          }
        );
        return updated;
      } else {
        const updated = this.studentRepository.update(
          { email: usernameOrEmail },
          {
            ...foundInfo,
            password: await this.hashPassword(newPass),
            updateAt: formatDate(new Date())
          }
        );
        return updated;
      }
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async checkUsername(username: string): Promise<boolean> {
    const foundInfo = await this.studentRepository.findOneBy({
      username: username
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Username is exist', 400);
  }

  async checkEmail(email: string): Promise<boolean> {
    const foundInfo = await this.studentRepository.findOneBy({
      email: email
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Email is exist', 400);
  }

  async checkPhone(phone: string): Promise<boolean> {
    const foundInfo = await this.studentRepository.findOneBy({
      phone: phone
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Phone number is exist', 400);
  }

  async add(createData: StudentDtoRequest) {
    const newStudent = await this.studentRepository.create({
      email: createData.email,
      name: createData.name,
      username: createData.username,
      password: createData.password,
      status: createData.status,
      phone: createData.phone,
      role: createData.role,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date())
    });

    return await this.studentRepository.save(newStudent);
  }

  async update(id: number, updateData: StudentDtoRequest) {
    const foundInfo = await this.studentRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Student with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      email: updateData.email,
      name: updateData.name,
      username: updateData.username,
      password: updateData.password,
      phone: updateData.phone,
      status: updateData.status,
      role: updateData.role
    };

    await this.studentRepository.update({ id }, newData);

    const updatedStudent = await this.studentRepository.findOneBy({ id });

    return updatedStudent;
  }

  async updateToken(username: string, token: string): Promise<void> {
    try {
      await this.studentRepository.update(
        { username: username },
        {
          refreshToken: token
        }
      );
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }

  async remove(id: number) {
    const foundInfo = await this.studentRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Student with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.studentRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.studentRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting student with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
