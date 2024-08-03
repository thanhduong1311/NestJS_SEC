import { Role } from 'src/entities/role.entity';

export class TeacherDtoRequest {
  email: string;

  name: string;

  username: string;

  phone: string;

  password: string;

  status: string;

  role: Role;
}

export class TeacherDtoDetailResponse {
  id: number;

  name: string;

  email: string;

  username: string;

  password: string;

  phone: string;

  status: string;

  language: string;

  theme: string;

  role: Role;

  createAt: string;

  updateAt: string;

  deleteAt: string;
}

export class TeacherDtoResponse {
  id: number;

  name: string;

  email: string;

  username: string;

  password: string;

  status: string;

  language: string;

  avatar: string;

  phone: string;

  theme: string;

  role: string;

  createAt: string;

  updateAt: string;
}
