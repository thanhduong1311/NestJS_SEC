import { Module } from '@nestjs/common';
import { ClassController } from './classes.controller';
import { ClassService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from 'src/entities/classes.entity';
import { JwtModule } from '@nestjs/jwt';
import { StudentInClass } from 'src/entities/studentInClass.entity';
import { Student } from 'src/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classes, StudentInClass, Student]), JwtModule],
  controllers: [ClassController],
  providers: [ClassService]
})
export class ClassManagementModule {}
