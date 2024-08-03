import { TypeOfTest } from 'src/entities/typeOfTest.entity';

export class TestDtoRequest {
  testName: string;

  type: TypeOfTest;

  createBy: string;

  updateBy: string;

  totalTime: number;

  createAt: string;

  updateAt: string;

  deleteAt: string;
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
