import { Role } from 'src/entities/role.entity';

export class AdminDtoRequest {
  email: string;

  username: string;

  password: string;

  status: string;

  role: Role;
}

export class AdminDtoResponse {
  id: number;

  name: string;

  email: string;

  username: string;

  password: string;

  status: string;

  language: string;

  avatar: string;

  theme: string;

  role: string;

  createAt: string;

  updateAt: string;
}

export class AdminDtoDetailResponse {
  id: number;

  name: string;

  email: string;

  username: string;

  password: string;

  status: string;

  language: string;

  theme: string;

  role: Role;

  createAt: string;

  updateAt: string;
}
