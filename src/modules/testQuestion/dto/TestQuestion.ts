import { Part } from 'src/entities/part.entity';
import { QuestionBank } from 'src/entities/questionBank.entity';
import { QuestionType } from 'src/entities/questionType.entity';
import { Test } from 'src/entities/test.entity';

export class TestQuestionDtoRequest {
  id: number;

  test: Test;

  type: QuestionType;

  part: Part;

  question: QuestionBank;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class TestQuestionDtoResponse {
  id: number;

  test: Test;

  type: QuestionType;

  part: Part;

  question: QuestionBank;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
