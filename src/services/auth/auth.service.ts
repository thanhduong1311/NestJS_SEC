import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthDtoRequest,
  ChangePassword,
  RecoverPassword,
  StudentDtoRegister,
  VerifyDtoRequest,
  VerifyRecovery,
  recoverCodeDto
} from './dto/authDto';
import { AdminService } from 'src/modules/admin/admin.service';
import { TeacherService } from 'src/modules/teacher/teacher.service';
import { StudentService } from 'src/modules/student/student.service';
import * as bcrypt from 'bcryptjs';
import { AdminDtoResponse } from 'src/modules/admin/dto/adminDto';
import {
  StudentDtoRequest,
  StudentDtoResponse
} from 'src/modules/student/dto/StudentDto';
import { TeacherDtoResponse } from 'src/modules/teacher/dto/teacherDto';
import { AccountStatus, Role, RoleName } from 'src/global/globalEnum';
import { RoleService } from 'src/modules/role/role.service';
import { formatDate } from 'src/utils/dateFormat';
import { EmailService } from 'src/services/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly adminService: AdminService,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,
    private readonly roleService: RoleService,
    private readonly emailService: EmailService
  ) {}

  // Login
  async login({ username, password }: AuthDtoRequest) {
    const foundUser =
      (await this.adminService.findOneByUsername(username)) ||
      (await this.teacherService.findOneByUsername(username)) ||
      (await this.studentService.findOneByUsername(username));

    if (!foundUser)
      throw new UnauthorizedException('Username or password is in correct!', '401');
    const checkIsStudent = await bcrypt.compare('STUDENT', String(process.env.STUDENT));

    if (checkIsStudent) {
      if (foundUser.status != 'ACTIVE') {
        throw new UnauthorizedException('Account is not active!', '401');
      }
    }
    const check = await bcrypt.compare(password, foundUser.password);

    if (check) {
      return this.generateToken(foundUser);
    }
  }

  // Create refresh token
  async refreshToken(refreshToken: string) {
    try {
      const verify: AdminDtoResponse | StudentDtoResponse | TeacherDtoResponse =
        await this.jwtService.verifyAsync(refreshToken, {
          secret: process.env.SECRET_KEY
        });

      const foundUser =
        (await this.adminService.findOneByUsername(verify.username)) ||
        (await this.teacherService.findOneByUsername(verify.username)) ||
        (await this.studentService.findOneByUsername(verify.username));

      if (foundUser) {
        return this.generateToken(foundUser);
      } else {
        throw new HttpException('Refresh token is invalid!', 400);
      }
    } catch (err) {
      throw new HttpException('Refresh token is invalid!', 400);
    }
  }

  // Create access token
  private async generateToken(
    payload: AdminDtoResponse | StudentDtoResponse | TeacherDtoResponse
  ) {
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET_KEY,
      expiresIn: process.env.EXPIRE_IN_REFRESH_TOKEN
    });

    if (payload.role === Role.ADMIN) {
      await this.adminService.updateToken(payload.username, refreshToken);
    } else if (payload.role === Role.TEACHER) {
      await this.teacherService.updateToken(payload.username, refreshToken);
    } else {
      await this.studentService.updateToken(payload.username, refreshToken);
    }

    return { accessToken, refreshToken };
  }

  // Hash password
  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  // Register new account for student
  async studentRegister(registerInfo: StudentDtoRegister) {
    try {
      const checkUsername =
        (await this.adminService.checkUsername(registerInfo.username)) ||
        (await this.teacherService.checkUsername(registerInfo.username)) ||
        (await this.studentService.checkUsername(registerInfo.username));
      if (checkUsername) throw new HttpException('Username is early exist', 400);

      const checkEmail =
        (await this.adminService.checkEmail(registerInfo.email)) ||
        (await this.teacherService.checkEmail(registerInfo.email)) ||
        (await this.studentService.checkEmail(registerInfo.email));
      if (checkEmail) throw new HttpException('Email is early exist', 400);

      const checkPhone =
        (await this.teacherService.checkPhone(registerInfo.phone)) ||
        (await this.studentService.checkPhone(registerInfo.phone));
      if (checkPhone) throw new HttpException('Phone number is early exist', 400);

      const role = await this.roleService.findOne(RoleName.STUDENT);

      const newStudent: StudentDtoRequest = {
        username: registerInfo.username,
        phone: registerInfo.phone,
        email: registerInfo.email,
        name: registerInfo.name,
        password: await this.hashPassword(registerInfo.password),
        status: AccountStatus.WAIT_FOR_APPROVE,
        role: role,
        createAt: formatDate(new Date()),
        updateAt: formatDate(new Date()),
        deleteAt: null
      };

      await this.studentService.add(newStudent);

      await this.emailService.sendVerifyEmail(newStudent.email);

      const response = await this.studentService.findOneByUsername(registerInfo.username);
      return response;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  // Check verify for account
  async verifyEmail(verifyInfo: VerifyDtoRequest) {
    try {
      const check = await this.emailService.checkVerifyCode(
        verifyInfo.email,
        verifyInfo.code
      );
      return check;
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  // Resend verify email
  async reSendVerifyEmail(verifyInfo: RecoverPassword) {
    try {
      const check = await this.emailService.sendVerifyEmail(verifyInfo.userOrEmail);
      return check;
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  async recoverCode(data: recoverCodeDto) {
    try {
      const checkUsername =
        (await this.adminService.findOneByUsername(data.userOrEmail)) ||
        (await this.studentService.findOneByUsername(data.userOrEmail)) ||
        (await this.teacherService.findOneByUsername(data.userOrEmail));

      if (checkUsername) {
        const check = await this.emailService.checkVerifyCode(
          checkUsername.email,
          data.code
        );
        return check;
      }

      const checkEmail =
        (await this.adminService.findOneByEmail(data.userOrEmail)) ||
        (await this.studentService.findOneByEmail(data.userOrEmail)) ||
        (await this.teacherService.findOneByEmail(data.userOrEmail));

      if (checkEmail) {
        const check = await this.emailService.checkVerifyCode(
          checkEmail.email,
          data.code
        );
        return check;
      }
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }
  handleHiddenEmail(email: string) {
    const placeDivider = email.indexOf('@');
    const startEmail = email.substring(0, placeDivider);
    const domain = email.substring(placeDivider);

    const hiddenEmail =
      startEmail.slice(0, 2) +
      '********' +
      startEmail.slice(startEmail.length - 2, startEmail.length);

    return hiddenEmail + domain;
  }

  async recoverPassword(data: RecoverPassword) {
    try {
      const checkUsername =
        (await this.adminService.findOneByUsername(data.userOrEmail)) ||
        (await this.studentService.findOneByUsername(data.userOrEmail)) ||
        (await this.teacherService.findOneByUsername(data.userOrEmail));

      if (checkUsername) {
        const check = await this.emailService.sendRecoverPasswordEmail(
          checkUsername.email,
          checkUsername.username
        );
        return { success: check, email: this.handleHiddenEmail(checkUsername.email) };
      }

      const checkEmail =
        (await this.adminService.findOneByEmail(data.userOrEmail)) ||
        (await this.studentService.findOneByEmail(data.userOrEmail)) ||
        (await this.teacherService.findOneByEmail(data.userOrEmail));

      if (checkEmail) {
        const check = await this.emailService.sendRecoverPasswordEmail(
          checkEmail.email,
          checkEmail.username
        );
        return { success: check, email: this.handleHiddenEmail(checkUsername.email) };
      }
      throw new HttpException('User is not exist', 400);
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  async resendEmailRecoverPassword(data: RecoverPassword) {
    try {
      const checkUsername =
        (await this.adminService.findOneByUsername(data.userOrEmail)) ||
        (await this.studentService.findOneByUsername(data.userOrEmail)) ||
        (await this.teacherService.findOneByUsername(data.userOrEmail));

      if (checkUsername) {
        const check = await this.emailService.sendRecoverPasswordEmail(
          checkUsername.email,
          checkUsername.username
        );
        return check;
      }

      const checkEmail =
        (await this.adminService.findOneByEmail(data.userOrEmail)) ||
        (await this.studentService.findOneByEmail(data.userOrEmail)) ||
        (await this.teacherService.findOneByEmail(data.userOrEmail));

      if (checkEmail) {
        const check = await this.emailService.sendRecoverPasswordEmail(
          checkEmail.email,
          checkEmail.username
        );
        return check;
      }
      throw new HttpException('User is not exist', 400);
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  //Check username code valid
  async verifyRecovery(verifyInfo: VerifyRecovery) {
    try {
      const check = await this.checkRecoveryCode(verifyInfo.userOrEmail, verifyInfo.code);
      return check;
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  async checkRecoveryCode(userOrEmail: string, code: string) {
    try {
      const checkUsername =
        (await this.adminService.findOneByUsername(userOrEmail)) ||
        (await this.studentService.findOneByUsername(userOrEmail)) ||
        (await this.teacherService.findOneByUsername(userOrEmail));

      if (checkUsername) {
        const check = await this.emailService.checkVerifyCode(checkUsername.email, code);
        return check;
      } else {
        return undefined;
      }
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }

  async changePassword(data: ChangePassword) {
    try {
      const checkUsername =
        (await this.adminService.findOneByUsername(data.userOrEmail)) ||
        (await this.studentService.findOneByUsername(data.userOrEmail)) ||
        (await this.teacherService.findOneByUsername(data.userOrEmail));

      if (checkUsername) {
        if (await bcrypt.compare('' + Role.ADMIN, checkUsername.role))
          return await this.adminService.changePassword(
            data.userOrEmail,
            data.newPassword
          );
        if (await bcrypt.compare('' + Role.STUDENT, checkUsername.role))
          return await this.studentService.changePassword(
            data.userOrEmail,
            data.newPassword
          );
        if (await bcrypt.compare('' + Role.TEACHER, checkUsername.role))
          return await this.teacherService.changePassword(
            data.userOrEmail,
            data.newPassword
          );
      }

      const checkEmail =
        (await this.adminService.findOneByEmail(data.userOrEmail)) ||
        (await this.studentService.findOneByEmail(data.userOrEmail)) ||
        (await this.teacherService.findOneByEmail(data.userOrEmail));

      if (checkEmail) {
        if (await bcrypt.compare('' + Role.ADMIN, checkUsername.role))
          return await this.adminService.changePassword(
            data.userOrEmail,
            data.newPassword
          );
        if (await bcrypt.compare('' + Role.STUDENT, checkUsername.role))
          return await this.studentService.changePassword(
            data.userOrEmail,
            data.newPassword
          );
        if (await bcrypt.compare('' + Role.TEACHER, checkUsername.role))
          return await this.teacherService.changePassword(
            data.userOrEmail,
            data.newPassword
          );
      }
      throw new HttpException('User is not exist', 400);
    } catch (err) {
      throw new HttpException(err.message, 401);
    }
  }
}
