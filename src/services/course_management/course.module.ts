import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course } from 'src/entities/course.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), JwtModule],
  providers: [CourseService],
  controllers: [CourseController]
})
export class CourseManagementModule {}
