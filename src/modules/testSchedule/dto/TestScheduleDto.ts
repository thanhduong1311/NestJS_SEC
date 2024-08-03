import { Test } from '@nestjs/testing';
import { Classes } from 'src/entities/classes.entity';

export class TestScheduleDtoRequest {
  startDate: string;

  endDate: string;

  class: Classes;

  test: Test;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class TestScheduleDtoResponse {
  id: number;

  startDate: string;

  endDate: string;

  class: Classes;

  test: Test;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
