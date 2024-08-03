import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/entities/admin.entity';
import { Repository } from 'typeorm';
import {
  AdminResponse,
  CreateAdminDto,
  CreateStudentDto,
  CreateTeacherDto,
  PaginationResponse,
  StudentResponse,
  TeacherResponse,
  UpdateAdminDto,
  UpdateStudentDto,
  UpdateTeacherDto
} from './dto/AccountManagementDto';
import { Teacher } from 'src/entities/teacher.entity';
import { Student } from 'src/entities/student.entity';
import { AccountStatus, RoleName } from 'src/global/globalEnum';
import { formatDate } from 'src/utils/dateFormat';
import { Role } from 'src/entities/role.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountManagementService {
  constructor(
    @InjectRepository(Admin) readonly adminRepository: Repository<Admin>,
    @InjectRepository(Teacher) readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student) readonly studentRepository: Repository<Student>,
    @InjectRepository(Role) readonly roleRepository: Repository<Role>
  ) {}

  async getAdminList(pageSize: number, pageNumber: number): Promise<PaginationResponse> {
    try {
      const page = pageNumber;
      const size = pageSize;
      const offset = (page - 1) * size;
      const admins = await this.adminRepository.find({
        take: size,
        skip: offset
      });
      if (!admins) return null;
      const result: AdminResponse[] = admins.map(item => {
        if (item.deleteAt == null)
          return {
            id: item.id,
            name: item.name,
            username: item.username,
            email: item.email,
            avatar: item.avatar,
            status: item.status,
            createAt: item.createAt
          };
      });

      const totalCount = await this.adminRepository.count();
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / size);

      const response: PaginationResponse = {
        pageData: result.filter(item => item != null),
        meta: {
          currentPage: Number(page),
          totalCount: totalCount,
          totalPages: totalPages,
          pageSize: Number(pageSize)
        }
      };
      return response;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async getAnAdmin(id: number): Promise<AdminResponse> {
    try {
      const admin = await this.adminRepository.findOneBy({ id: id });
      if (admin && admin.deleteAt == null)
        return {
          id: admin.id,
          name: admin.name,
          username: admin.username,
          email: admin.email,
          avatar: admin.avatar,
          status: admin.status,
          createAt: admin.createAt
        };
      throw new HttpException('Can not find admin with id = ' + id, 400);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async createAdmin(createData: CreateAdminDto): Promise<any> {
    try {
      const checkUsername = await this.checkUsername(createData.username);
      if (checkUsername) throw new HttpException('Username is exist!', 400);
      const checkEmail = await this.checkEmail(createData.email);
      if (checkEmail) throw new HttpException('Email is exist!', 400);

      const role = await this.roleRepository.findOneBy({ id: Number(RoleName.ADMIN) });

      const newAdmin = this.adminRepository.save({
        ...createData,
        password: await this.hashPassword(createData.password),
        role: role,
        status: AccountStatus.ACTIVE,
        createAt: formatDate(new Date()),
        updateAt: formatDate(new Date())
      });
      return newAdmin;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async updateAdmin(id: number, updateData: UpdateAdminDto): Promise<any> {
    try {
      const foundInfo = await this.adminRepository.findOneBy({ id: id });

      if (!foundInfo || foundInfo.deleteAt != null)
        throw new HttpException('Can not find admin with id = ' + id, 400);

      const role = await this.roleRepository.findOneBy({ id: Number(RoleName.ADMIN) });

      await this.adminRepository.update(
        { id: id },
        {
          ...updateData,
          password: await this.hashPassword(updateData.password),
          role: role,
          status: AccountStatus.ACTIVE,
          updateAt: formatDate(new Date())
        }
      );
      return this.getAnAdmin(id);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async deleteAdmin(id: number): Promise<any> {
    try {
      const foundInfo = await this.adminRepository.findOneBy({ id: id });

      if (!foundInfo || foundInfo.deleteAt != null)
        throw new HttpException('Can not find admin with id = ' + id, 400);

      const deleteAdmin = this.adminRepository.update(
        { id: id },
        {
          ...foundInfo,
          deleteAt: formatDate(new Date())
        }
      );
      return deleteAdmin;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async getTeacherList(
    pageSize: number,
    pageNumber: number
  ): Promise<PaginationResponse> {
    try {
      const page = pageNumber;
      const size = pageSize;
      const offset = (page - 1) * size;
      const teachers = await this.teacherRepository.find({
        take: size,
        skip: offset
      });
      const result: TeacherResponse[] = teachers.map(item => {
        if (item.deleteAt == null)
          return {
            id: item.id,
            name: item.name,
            username: item.username,
            phone: item.phone,
            email: item.email,
            dob: item.dob,
            address: item.address,
            avatar: item.avatar,
            status: item.status,
            createAt: item.createAt
          };
      });
      const totalCount = await this.teacherRepository.count();
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / size);

      const response: PaginationResponse = {
        pageData: result.filter(item => item != null),
        meta: {
          currentPage: Number(page),
          totalCount: totalCount,
          totalPages: totalPages,
          pageSize: Number(pageSize)
        }
      };
      return response;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async getATeacher(id: number): Promise<TeacherResponse> {
    try {
      const teacher = await this.teacherRepository.findOneBy({ id: id });
      if (teacher.deleteAt == null)
        return {
          id: teacher.id,
          name: teacher.name,
          username: teacher.username,
          phone: teacher.phone,
          email: teacher.email,
          status: teacher.status,
          dob: teacher.dob,
          address: teacher.address,
          avatar: teacher.avatar,
          createAt: teacher.createAt
        };
      return null;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async createTeacher(createData: CreateTeacherDto): Promise<any> {
    try {
      const checkUsername = await this.checkUsername(createData.username);
      if (checkUsername) throw new HttpException('Username is exist!', 400);
      const checkEmail = await this.checkEmail(createData.email);
      if (checkEmail) throw new HttpException('Email is exist!', 400);
      const checkPhone = await this.checkEmail(createData.email);
      if (checkPhone) throw new HttpException('Phone number is exist!', 400);

      const role = await this.roleRepository.findOneBy({ id: Number(RoleName.TEACHER) });

      const newTeacher = this.teacherRepository.save({
        ...createData,
        password: await this.hashPassword(createData.password),
        role: role,
        status: AccountStatus.ACTIVE,
        createAt: formatDate(new Date()),
        updateAt: formatDate(new Date())
      });
      return newTeacher;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async updateTeacher(id: number, updateData: UpdateTeacherDto): Promise<any> {
    try {
      const foundInfo = await this.teacherRepository.findOneBy({ id: id });

      if (!foundInfo || foundInfo.deleteAt != null)
        throw new HttpException('Can not find student with id = ' + id, 400);

      const role = await this.roleRepository.findOneBy({ id: Number(RoleName.STUDENT) });

      await this.teacherRepository.update(
        { id: id },
        {
          ...updateData,
          password: await this.hashPassword(updateData.password),
          role: role,
          status: AccountStatus.ACTIVE,
          updateAt: formatDate(new Date())
        }
      );
      return this.getATeacher(id);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async deleteTeacher(id: number): Promise<any> {
    try {
      const foundInfo = await this.teacherRepository.findOneBy({ id: id });

      if (!foundInfo || foundInfo.deleteAt != null)
        throw new HttpException('Can not find student with id = ' + id, 400);

      const deleteTeacher = this.teacherRepository.update(
        { id: id },
        {
          ...foundInfo,
          deleteAt: formatDate(new Date())
        }
      );
      return deleteTeacher;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async getStudentList(
    pageSize?: number,
    pageNumber?: number
  ): Promise<PaginationResponse> {
    try {
      const page = pageNumber;
      const size = pageSize;
      const offset = (page - 1) * size;
      const students = await this.studentRepository.find({
        take: size,
        skip: offset
      });
      const result: StudentResponse[] = students.map(item => {
        if (item.deleteAt == null && item.status !== AccountStatus.WAIT_FOR_APPROVE)
          return {
            id: item.id,
            name: item.name,
            username: item.username,
            phone: item.phone,
            email: item.email,
            status: item.status,
            address: item.address,
            dob: item.dob,
            avatar: item.avatar,
            createAt: item.createAt
          };
      });
      const totalCount = await this.studentRepository.count();
      // Calculate total pages
      const totalPages = Math.ceil(totalCount / size);

      const response: PaginationResponse = {
        pageData: result.filter(item => item != null),
        meta: {
          currentPage: Number(page),
          totalCount: totalCount,
          totalPages: totalPages,
          pageSize: Number(pageSize)
        }
      };
      return response;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async getAllPendingStudent(): Promise<StudentResponse[]> {
    try {
      const students = await this.studentRepository.find();
      const result: StudentResponse[] = students.map(item => {
        if (item.deleteAt == null && item.status === AccountStatus.WAIT_FOR_APPROVE)
          return {
            id: item.id,
            name: item.name,
            username: item.username,
            phone: item.phone,
            email: item.email,
            status: item.status,
            address: item.address,
            dob: item.dob,
            avatar: item.avatar,
            createAt: item.createAt
          };
      });
      return result.filter(item => item != null);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async getAStudent(id: number): Promise<StudentResponse> {
    try {
      const student = await this.studentRepository.findOneBy({ id: id });
      if (!student || student.deleteAt != null)
        throw new HttpException('Can not find student with id = ' + id, 400);
      if (student.deleteAt == null)
        return {
          id: student.id,
          name: student.name,
          username: student.username,
          phone: student.phone,
          email: student.email,
          status: student.status,
          address: student.address,
          dob: student.dob,
          avatar: student.avatar,
          createAt: student.createAt
        };
      return null;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async createStudent(createData: CreateStudentDto): Promise<any> {
    try {
      const checkUsername = await this.checkUsername(createData.username);
      if (checkUsername) throw new HttpException('Username is exist!', 400);
      const checkEmail = await this.checkEmail(createData.email);
      if (checkEmail) throw new HttpException('Email is exist!', 400);
      const checkPhone = await this.checkEmail(createData.email);
      if (checkPhone) throw new HttpException('Phone number is exist!', 400);

      const role = await this.roleRepository.findOneBy({ id: Number(RoleName.STUDENT) });

      const newStudent = this.studentRepository.save({
        ...createData,
        password: await this.hashPassword(createData.password),
        role: role,
        status: AccountStatus.ACTIVE,
        createAt: formatDate(new Date()),
        updateAt: formatDate(new Date())
      });
      return newStudent;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async updateStudent(id: number, updateData: UpdateStudentDto): Promise<any> {
    try {
      const foundInfo = await this.studentRepository.findOneBy({ id: id });

      if (!foundInfo || foundInfo.deleteAt != null)
        throw new HttpException('Can not find student with id = ' + id, 400);

      const role = await this.roleRepository.findOneBy({ id: Number(RoleName.STUDENT) });

      await this.studentRepository.update(
        { id: id },
        {
          ...updateData,
          password: await this.hashPassword(updateData.password),
          role: role,
          status: AccountStatus.ACTIVE,
          updateAt: formatDate(new Date())
        }
      );
      return this.getAStudent(id);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async deleteStudent(id: number): Promise<any> {
    try {
      const foundInfo = await this.studentRepository.findOneBy({ id: id });

      if (!foundInfo || foundInfo.deleteAt != null)
        throw new HttpException('Can not find student with id = ' + id, 400);

      const deleteStudent = this.studentRepository.update(
        { id: id },
        {
          ...foundInfo,
          deleteAt: formatDate(new Date())
        }
      );
      return deleteStudent;
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async activeAccount(username: string): Promise<any> {
    try {
      const check = await this.checkUsername(username);

      if (!check)
        throw new HttpException('Can not find user with username = ' + username, 400);

      const foundStudent = await this.studentRepository.findOneBy({ username: username });

      if (foundStudent) {
        const student = this.studentRepository.update(
          { username: username },
          {
            ...foundStudent,
            status: AccountStatus.ACTIVE,
            updateAt: formatDate(new Date())
          }
        );
        return student;
      }

      const foundTeacher = await this.teacherRepository.findOneBy({ username: username });
      if (foundTeacher) {
        const teacher = this.teacherRepository.update(
          { username: username },
          {
            ...foundTeacher,
            status: AccountStatus.ACTIVE,
            updateAt: formatDate(new Date())
          }
        );
        return teacher;
      }
      const foundAdmin = await this.adminRepository.findOneBy({ username: username });
      if (foundAdmin) {
        const admin = this.teacherRepository.update(
          { username: username },
          {
            ...foundAdmin,
            status: AccountStatus.ACTIVE,
            updateAt: formatDate(new Date())
          }
        );
        return admin;
      }
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async disableAccount(username: string): Promise<any> {
    try {
      const check = await this.checkUsername(username);

      if (!check)
        throw new HttpException('Can not find user with username = ' + username, 400);

      const foundStudent = await this.studentRepository.findOneBy({ username: username });

      if (foundStudent) {
        const student = this.studentRepository.update(
          { username: username },
          {
            ...foundStudent,
            status: AccountStatus.BLOCKED,
            updateAt: formatDate(new Date())
          }
        );
        return student;
      }

      const foundTeacher = await this.teacherRepository.findOneBy({ username: username });
      if (foundTeacher) {
        const teacher = this.teacherRepository.update(
          { username: username },
          {
            ...foundTeacher,
            status: AccountStatus.BLOCKED,
            updateAt: formatDate(new Date())
          }
        );
        return teacher;
      }
      const foundAdmin = await this.adminRepository.findOneBy({ username: username });
      if (foundAdmin) {
        const admin = this.teacherRepository.update(
          { username: username },
          {
            ...foundAdmin,
            status: AccountStatus.BLOCKED,
            updateAt: formatDate(new Date())
          }
        );
        return admin;
      }
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async approveAccount(username: string): Promise<any> {
    try {
      const foundStudent = await this.studentRepository.findOneBy({ username: username });

      if (foundStudent) {
        const student = this.studentRepository.update(
          { username: username },
          {
            ...foundStudent,
            status: AccountStatus.ACTIVE,
            updateAt: formatDate(new Date())
          }
        );
        return student;
      }

      throw new HttpException('Can not find user with username = ' + username, 400);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  async rejectAccount(username: string): Promise<any> {
    try {
      const foundStudent = await this.studentRepository.findOneBy({ username: username });

      if (foundStudent) {
        const student = this.deleteStudent(foundStudent.id);
        return student;
      }

      throw new HttpException('Can not find user with username = ' + username, 400);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  // Check functions
  async checkUsername(username: string): Promise<boolean> {
    const existed =
      (await this.adminRepository.findOneBy({ username: username })) ||
      (await this.teacherRepository.findOneBy({ username: username })) ||
      (await this.studentRepository.findOneBy({ username: username }));

    if (!existed) return false;
    return true;
  }

  async checkEmail(email: string): Promise<boolean> {
    const existed =
      (await this.adminRepository.findOneBy({ email: email })) ||
      (await this.teacherRepository.findOneBy({ email: email })) ||
      (await this.studentRepository.findOneBy({ email: email }));

    if (!existed) return false;
    return true;
  }

  async checkPhone(phone: string): Promise<boolean> {
    const existed =
      (await this.teacherRepository.findOneBy({ phone: phone })) ||
      (await this.studentRepository.findOneBy({ phone: phone }));

    if (!existed) return false;
    return true;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
