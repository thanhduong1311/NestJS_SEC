import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/entities/admin.entity';
import { Role } from 'src/entities/role.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Student } from 'src/entities/student.entity';
import { AdminService } from 'src/modules/admin/admin.service';
import { TeacherService } from 'src/modules/teacher/teacher.service';
import { StudentService } from 'src/modules/student/student.service';
import { RoleService } from 'src/modules/role/role.service';
import { EmailToken } from 'src/entities/EmailToken.entity';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Role, Teacher, Student, Role, EmailToken]),
    PassportModule,
    JwtModule.register({
      secret: 'SimpleEnglishCenter',
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminService,
    TeacherService,
    StudentService,
    RoleService,
    EmailService
  ]
})
export class AuthModule {}
