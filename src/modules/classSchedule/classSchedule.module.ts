import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassScheduleService } from './classSchedule.service';
import { ClassScheduleController } from './classSchedule.controller';
import { ClassSchedule } from 'src/entities/classSchedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClassSchedule])],
  providers: [ClassScheduleService],
  controllers: [ClassScheduleController]
})
export class ClassScheduleModule {}
