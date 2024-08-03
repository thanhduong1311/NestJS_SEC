import { Module } from '@nestjs/common';
import { ClassController } from './classes.controller';
import { ClassService } from './classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from 'src/entities/classes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Classes])],
  controllers: [ClassController],
  providers: [ClassService]
})
export class ClassModule {}
