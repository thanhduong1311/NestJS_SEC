import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/admin.entity';
import { HttpStatus } from 'src/global/globalEnum';
import { formatDate } from 'src/utils/dateFormat';
import { Repository } from 'typeorm';
import { AdminDtoRequest, AdminDtoResponse } from './dto/adminDto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(@InjectRepository(Admin) private adminRepository: Repository<Admin>) {}

  async findAll(): Promise<AdminDtoResponse[]> {
    const admins = await this.adminRepository.find();
    const response: AdminDtoResponse[] = [];

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .getOne();

    admins.forEach((item: Admin) => {
      if (item.deleteAt == null) {
        const newInfo: AdminDtoResponse = {
          id: item.id,
          role: admin.role.roleName,
          name: item.name,
          email: item.email,
          username: item.username,
          password: item.password,
          status: item.status,
          language: item.language,
          avatar: item.avatar,
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
    const foundInfo = await this.adminRepository.findOneBy({ id: id });
    if (!foundInfo || foundInfo.deleteAt != null)
      throw new HttpException('Cannot found Admin with id ' + id, HttpStatus.ERROR);

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .where('admin.id = :id', { id: id })
      .getOne();

    const newInfo: AdminDtoResponse = {
      id: admin.id,
      role: admin.role.roleName,
      name: admin.name,
      email: admin.email,
      username: admin.username,
      password: admin.password,
      status: admin.status,
      avatar: admin.avatar,
      language: admin.language,
      theme: admin.theme,
      createAt: admin.createAt,
      updateAt: admin.updateAt
    };
    return newInfo;
  }

  async findOneByUsername(username: string) {
    const foundInfo = await this.adminRepository.findOneBy({
      username: username
    });
    if (!foundInfo || foundInfo.deleteAt != null) return undefined;

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .where('admin.username = :username', { username: username })
      .getOne();

    const newInfo: AdminDtoResponse = {
      id: admin.id,
      role: admin.role.roleName,
      name: admin.name,
      email: admin.email,
      username: admin.username,
      password: admin.password,
      status: admin.status,
      avatar: admin.avatar,
      language: admin.language,
      theme: admin.theme,
      createAt: admin.createAt,
      updateAt: admin.updateAt
    };
    return newInfo;
  }

  async findOneByEmail(email: string) {
    const foundInfo = await this.adminRepository.findOneBy({
      email: email
    });
    if (!foundInfo || foundInfo.deleteAt != null) return undefined;

    const admin = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoinAndSelect('admin.role', 'role')
      .where('admin.email = :email', { email: email })
      .getOne();

    const newInfo: AdminDtoResponse = {
      id: admin.id,
      role: admin.role.roleName,
      name: admin.name,
      email: admin.email,
      username: admin.username,
      password: admin.password,
      status: admin.status,
      avatar: admin.avatar,
      language: admin.language,
      theme: admin.theme,
      createAt: admin.createAt,
      updateAt: admin.updateAt
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
      const foundInfo = await this.adminRepository.findOneBy({
        username: usernameOrEmail
      });

      if (foundInfo) {
        const updated = this.adminRepository.update(
          { username: usernameOrEmail },
          {
            ...foundInfo,
            password: await this.hashPassword(newPass),
            updateAt: formatDate(new Date())
          }
        );
        return updated;
      } else {
        const updated = this.adminRepository.update(
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
    const foundInfo = await this.adminRepository.findOneBy({
      username: username
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Username is exist', 400);
  }

  async checkEmail(email: string): Promise<boolean> {
    const foundInfo = await this.adminRepository.findOneBy({
      email: email
    });
    if (!foundInfo) return undefined;
    throw new HttpException('Email is exist', 400);
  }

  async add(createData: AdminDtoRequest) {
    const newRole = await this.adminRepository.create({
      email: createData.email,
      username: createData.username,
      password: createData.password,
      status: createData.status,
      role: createData.role,
      createAt: formatDate(new Date()),
      updateAt: formatDate(new Date())
    });

    return await this.adminRepository.save(newRole);
  }

  async update(id: number, updateData: AdminDtoRequest) {
    const foundInfo = await this.adminRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Admin with id ' + id, HttpStatus.ERROR);

    const newData = {
      updateAt: formatDate(new Date()),
      createAt: foundInfo.createAt,
      email: updateData.email,
      username: updateData.username,
      password: updateData.password,
      status: updateData.status,
      role: updateData.role
    };

    await this.adminRepository.update({ id }, newData);

    const updatedAdmin = await this.adminRepository.findOneBy({ id });

    return updatedAdmin;
  }

  async updateToken(username: string, token: string) {
    try {
      await this.adminRepository.update(
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
    const foundInfo = await this.adminRepository.findOneBy({ id });

    if (!foundInfo)
      throw new HttpException('Cannot found Admin with id ' + id, HttpStatus.ERROR);

    foundInfo.deleteAt = formatDate(new Date());

    await this.adminRepository.update(
      { id },
      {
        ...foundInfo
      }
    );

    const deletedData = await this.adminRepository.findOneBy({ id });

    if (deletedData.deleteAt == null) {
      throw new HttpException('Some error occur when deleting admin with id ' + id, 500);
    }

    return deletedData;
  }
}
