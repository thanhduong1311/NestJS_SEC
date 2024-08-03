import { QuestionType } from 'src/entities/questionType.entity';

export class QuestionBankDtoRequest {
  content: string;

  questionType: QuestionType;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class QuestionBankDtoResponse {
  id: number;

  content: string;

  questionType: QuestionType;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
