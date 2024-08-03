import { Module } from '@nestjs/common';
import { TeacherServiceController } from './teacherService.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TeacherService } from './teacherService.service';
import { JwtModule } from '@nestjs/jwt';
import { Attendance } from 'src/entities/atttendance.entity';
import { TestSchedule } from 'src/entities/testSchedule.entity';
import { ClassSchedule } from 'src/entities/classSchedule.entity';
import { Admin } from 'src/entities/admin.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Student } from 'src/entities/student.entity';
import { StudentInClass } from 'src/entities/studentInClass.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from 'src/entities/classes.entity';
import { Test } from 'src/entities/test.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentInClass,
      Student,
      Teacher,
      Admin,
      ClassSchedule,
      TestSchedule,
      Attendance,
      Classes,
      Test
    ]),
    JwtModule
  ],
  controllers: [TeacherServiceController],
  providers: [TeacherService, CloudinaryService]
})
export class TeacherServiceModule {}
