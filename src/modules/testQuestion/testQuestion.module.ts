import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestQuestionService } from './testQuestion.service';
import { TestQuestionController } from './testQuestion.controller';
import { TestQuestion } from 'src/entities/testQuestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestQuestion])],
  providers: [TestQuestionService],
  controllers: [TestQuestionController]
})
export class TestQuestionModule {}
