import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountManagementController } from './accountManagement.controller';
import { AccountManagementService } from './accountManagement.service';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from 'src/entities/admin.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Student } from 'src/entities/student.entity';
import { Role } from 'src/entities/role.entity';
import { EmailToken } from 'src/entities/EmailToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Role, Teacher, Student, Role, EmailToken]),
    JwtModule
  ],
  controllers: [AccountManagementController],
  providers: [AccountManagementService]
})
export class AccountManagementModule {}
