import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus } from 'src/global/globalEnum';
import { formatDate } from 'src/utils/dateFormat';
import { Repository } from 'typeorm';
import { TeacherDtoRequest, TeacherDtoResponse } from './dto/teacherDto';
import { Teacher } from 'src/entities/teacher.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>
  ) {}

  async findAll() {
    const teachers = await this.teacherRepository.find();
    const response: TeacherDtoResponse[] = [];

    const teacher = await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.role', 'role')
      .getOne();

    teachers.forEach((item: Teacher) => {
      if (item.deleteAt == null) {
        const newInfo: TeacherDtoResponse = {
          id: item.id,
          role: teacher.role.roleName,
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
    const foundInfo = await this.teacherRepository.findOneBy({ id: id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found Teacher with id ' + id, HttpStatus.ERROR);
    const teacher = await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.role', 'role')
      .where('teacher.id = :id', { id: id })
      .getOne();

    const newInfo: TeacherDtoResponse = {
      id: teacher.id,
      role: teacher.role.roleName,
      name: teacher.name,
      email: teacher.email,
      username: teacher.username,
      password: teacher.password,
      phone: teacher.phone,
      status: teacher.status,
      avatar: teacher.avatar,
      language: teacher.language,
      theme: teacher.theme,
      createAt: teacher.createAt,
      updateAt: teacher.updateAt
    };
    return newInfo;
  }

  async findOneByUsername(username: string) {
    const foundInfo = await this.teacherRepository.findOneBy({
      username: username
    });
    if (!foundInfo || foundInfo.deleteAt != null) return undefined;

    const teacher = await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.role', 'role')
      .where('teacher.username = :username', { username: username })
      .getOne();

    const newInfo: TeacherDtoResponse = {
      id: teacher.id,
      role: teacher.role.roleName,
      name: teacher.name,
      email: teacher.email,
      username: teacher.username,
      password: teacher.password,
      phone: teacher.phone,
      status: teacher.status,
      avatar: teacher.avatar,
      language: teacher.language,
      theme: teacher.theme,
      createAt: teacher.createAt,
      updateAt: teacher.updateAt
    };
    return newInfo;
  }

  async findOneByEmail(email: string) {
    const foundInfo = await this.teacherRepository.findOneBy({
      email: email
    });
    if (!foundInfo || foundInfo.deleteAt != null) return undefined;

    const teacher = await this.teacherRepository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.role', 'role')
      .where('teacher.email = :email', { email: email })
      .getOne();

    const newInfo: TeacherDtoResponse = {
      id: teacher.id,
      role: teacher.role.roleName,
      name: teacher.name,
      email: teacher.email,
      username: teacher.username,
      password: teacher.password,
      phone: teacher.phone,
      status: teacher.status,
      avatar: teacher.avatar,
      language: teacher.language,
      theme: teacher.theme,
      createAt: teacher.createAt,
      updateAt: teacher.updateAt
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
      const foundInfo = await this.teacherRepository.findOneBy({
        username: usernameOrEmail
      });

      if (foundInfo) {
        const updated = this.teacherRepository.update(
          { username: usernameOrEmail },
          {
            ...foundInfo,
            password: await this.hashPassword(newPass),
            updateAt: formatDate(new Date())
          }
        );
        return updated;
      } else {
        const updated = this.teacherRepository.update(
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
    const foundInfo = await this.teacherRepository.findOneBy({
      username: username
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Username is exist', 400);
  }

  async checkEmail(email: string): Promise<boolean> {
    const foundInfo = await this.teacherRepository.findOneBy({
      email: email
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Email is exist', 400);
  }

  async checkPhone(phone: string): Promise<boolean> {
    const foundInfo = await this.teacherRepository.findOneBy({
      phone: phone
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Phone number is exist', 400);
  }

  async add(createData: TeacherDtoRequest) {
    const newTeacher = await this.teacherRepository.create({
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

    return await this.teacherRepository.save(newTeacher);
  }

  async update(id: number, updateData: TeacherDtoRequest) {
    const foundInfo = await this.teacherRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Teacher with id ' + id, HttpStatus.ERROR);

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

    await this.teacherRepository.update({ id }, newData);

    const updatedTeacher = await this.teacherRepository.findOneBy({ id });

    return updatedTeacher;
  }

  async updateToken(username: string, token: string): Promise<void> {
    try {
      await this.teacherRepository.update(
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
    const foundInfo = await this.teacherRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Teacher with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.teacherRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.teacherRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException(
        'Some error occur when deleting teacher with id ' + id,
        500
      );
    }

    return deletedData;
  }
}
