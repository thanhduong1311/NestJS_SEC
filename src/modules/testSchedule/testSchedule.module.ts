import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestScheduleService } from './testSchedule.service';
import { TestScheduleController } from './testSchedule.controller';
import { TestSchedule } from 'src/entities/testSchedule.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TestSchedule])],
  providers: [TestScheduleService],
  controllers: [TestScheduleController]
})
export class TestScheduleModule {}
