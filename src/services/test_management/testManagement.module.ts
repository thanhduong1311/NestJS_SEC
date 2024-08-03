import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestManagementController } from './testManagement.controller';
import { TestManagementService } from './testManagement.service';
import { QuestionBank } from 'src/entities/questionBank.entity';
import { AnswerBank } from 'src/entities/answerBank.entity';
import { QuestionType } from 'src/entities/questionType.entity';
import { Test } from 'src/entities/test.entity';
import { Skill } from 'src/entities/skill.entity';
import { TestQuestion } from 'src/entities/testQuestion.entity';
import { TestSchedule } from 'src/entities/testSchedule.entity';
import { TypeOfTest } from 'src/entities/typeOfTest.entity';
import { Part } from 'src/entities/part.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionBank,
      AnswerBank,
      QuestionType,
      Test,
      Skill,
      TestQuestion,
      TestSchedule,
      TypeOfTest,
      Part,
      CloudinaryModule
    ]),
    JwtModule
  ],
  controllers: [TestManagementController],
  providers: [TestManagementService, CloudinaryService]
})
export class TestManagementModule {}
