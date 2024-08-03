export class AuthDtoRequest {
  username: string;
  password: string;
}

export class AuthDtoResponse {
  accessToken: string;
  refreshToken: string;
  profile: any;
}

export class RefreshToken {
  refreshToken: string;
}

export class RecoverPassword {
  userOrEmail: string;
}

export class VerifyRecovery {
  userOrEmail: string;
  code: string;
}

export class ChangePassword {
  userOrEmail: string;
  newPassword: string;
}

export class StudentDtoRegister {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
}

export class VerifyDtoRequest {
  email: string;
  code: string;
}

export class recoverCodeDto {
  userOrEmail: string;
  code: string;
}

export class ReVerifyDtoRequest {
  email: string;
}
