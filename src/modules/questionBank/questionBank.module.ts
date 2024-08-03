import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBankService } from './questionBank.service';
import { QuestionBank } from 'src/entities/questionBank.entity';
import { QuestionBankController } from './questionBank.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionBank])],
  providers: [QuestionBankService],
  controllers: [QuestionBankController]
})
export class QuestionBankModule {}
