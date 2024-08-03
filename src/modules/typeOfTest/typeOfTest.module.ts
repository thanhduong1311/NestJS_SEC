import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfTest } from 'src/entities/typeOfTest.entity';
import { TypeOfTestService } from './typeOfTest.service';
import { TypeOfTestController } from './typeOfTest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOfTest])],
  providers: [TypeOfTestService],
  controllers: [TypeOfTestController]
})
export class TypeOfTestModule {}
