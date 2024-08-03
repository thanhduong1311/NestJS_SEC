import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionTypeService } from './questionType.service';
import { QuestionType } from 'src/entities/questionType.entity';
import { QuestionTypeController } from './questionType.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionType])],
  providers: [QuestionTypeService],
  controllers: [QuestionTypeController]
})
export class QuestionTypeModule {}
