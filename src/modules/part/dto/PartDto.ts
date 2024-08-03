import { Skill } from 'src/entities/skill.entity';

export class PartDtoRequest {
  id: number;

  partName: string;

  data: string;

  index: number;

  description: string;

  skill: Skill;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class PartDtoResponse {
  id: number;

  partName: string;

  data: string;

  index: number;

  description: string;

  skill: Skill;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
