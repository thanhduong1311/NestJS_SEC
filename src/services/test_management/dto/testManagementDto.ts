import { IsInt, Min } from 'class-validator';
import { QuestionType } from 'src/entities/questionType.entity';
import { TypeOfTest } from 'src/entities/typeOfTest.entity';

export class PaginationRequest {
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsInt()
  @Min(1)
  pageNumber: number = 1;
}

export class PaginationResponse {
  pageData: any;
  meta: {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
  };
}

export class QuestionBankDtoRequest {
  content: string;
  questionType: number;
  deleteAt: string;
}

export class QuestionWithAnswerDtoRequest {
  questions: QuestionWithAnswers[];
}

export class QuestionWithAnswers {
  content: string;

  questionType: number;

  answers: AnswerInQuestion[];
}

export class AnswerInQuestion {
  content: string;
  answerCorrect: boolean;
}

export class QuestionBankDtoResponse {
  id: number;

  content: string;

  questionType: QuestionType;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class AnswerBankDtoRequest {
  content: string;

  question: number;

  isCorrect: boolean;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class AnswerBankDtoResponse {
  id: number;

  content: string;

  question: number;

  isCorrect: boolean;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class GetQuestionDto {
  ids: number[];
}

export class TestDtoRequest {
  testName: string;

  type: TypeOfTest;

  createBy: string;

  totalTime: number;
}

export class TestDtoResponse {
  id: number;

  testName: string;

  type: TypeOfTest;

  createBy: string;

  updateBy: string;

  totalTime: number;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class CreatePartRequest {
  partID: number;
  question: number[];
}

export class CreateSkillRequest {
  skillID: number;
  skillQuestion: CreatePartRequest[];
}

export class CreateTestTemplateRequest {
  testID: number;
  testSkillQuestion: CreateSkillRequest[];
}

export class PartDto {
  partName: string;
  data: string;
  index: number;
  description: string;
  file: string;
  skill: number;
}
