import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Teacher } from 'src/entities/teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Role])],
  controllers: [],
  providers: [TeacherService]
})
export class TeacherModule {}
