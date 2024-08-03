import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './modules/admin/admin.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { StudentModule } from './modules/student/student.module';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { AuthModule } from './services/auth/auth.module';
import { EmailModule } from './services/email/email.module';
import { AccountManagementModule } from './services/account_management/accountManagement.module';
import { CourseManagementModule } from './services/course_management/course.module';
import { ClassManagementModule } from './services/class_management/classes.module';
import { StudentServiceModule } from './services/student_service/studentService.module';
import { TestManagementModule } from './services/test_management/testManagement.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TeacherServiceModule } from './services/teacher_service/teacherService.module';
import { DashboardModule } from './services/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TeacherModule,
    StudentModule,
    AdminModule,
    AuthModule,
    EmailModule,
    AccountManagementModule,
    CourseManagementModule,
    ClassManagementModule,
    StudentServiceModule,
    TestManagementModule,
    CloudinaryModule,
    TeacherServiceModule,
    DashboardModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
