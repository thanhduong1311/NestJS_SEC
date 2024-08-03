import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { StudentService } from './studentService.service';
import { StudentServiceController } from './studentService.controller';
import { Student } from 'src/entities/student.entity';
import { StudentInClass } from 'src/entities/studentInClass.entity';
import { ClassSchedule } from 'src/entities/classSchedule.entity';
import { Attendance } from 'src/entities/atttendance.entity';
import { TestSchedule } from 'src/entities/testSchedule.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Admin } from 'src/entities/admin.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TestQuestion } from 'src/entities/testQuestion.entity';
import { AnswerBank } from 'src/entities/answerBank.entity';

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
      TestQuestion,
      AnswerBank
    ]),
    JwtModule
  ],
  controllers: [StudentServiceController],
  providers: [StudentService, CloudinaryService]
})
export class StudentServiceModule {}
