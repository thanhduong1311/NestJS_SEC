import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseResultService } from './courseResult.service';
import { CourseResultController } from './CourseResult.controller';
import { CourseResult } from 'src/entities/courseResult.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseResult])],
  providers: [CourseResultService],
  controllers: [CourseResultController]
})
export class CourseResultModule {}
