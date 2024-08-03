import { Role } from 'src/entities/role.entity';

export class StudentDtoRequest {
  name: string;

  email: string;

  phone: string;

  username: string;

  password: string;

  status: string;

  role: Role;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class StudentDtoDetailResponse {
  id: number;

  name: string;

  email: string;

  phone: string;

  username: string;

  password: string;

  status: string;

  language: string;

  theme: string;

  role: Role;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}
export class StudentDtoResponse {
  id: number;

  name: string;

  email: string;

  phone: string;

  username: string;

  password: string;

  status: string;

  avatar: string;

  language: string;

  theme: string;

  role: string;

  createAt: string;

  updateAt: string;
}
