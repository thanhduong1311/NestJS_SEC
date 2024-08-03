import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentInClassService } from './studentnClass.service';
import { StudentInClassController } from './studentnClass.controller';
import { StudentInClass } from 'src/entities/studentInClass.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentInClass])],
  providers: [StudentInClassService],
  controllers: [StudentInClassController]
})
export class StudentInClassModule {}
