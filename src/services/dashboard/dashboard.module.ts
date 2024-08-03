import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from 'src/entities/admin.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Student } from 'src/entities/student.entity';
import { Role } from 'src/entities/role.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Course } from 'src/entities/course.entity';
import { Classes } from 'src/entities/classes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Role, Teacher, Student, Course, Classes]),
    JwtModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
