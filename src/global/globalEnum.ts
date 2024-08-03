export enum HttpStatus {
  ERROR = 404,
  SUCCESS = 200
}

export enum HttpMessage {
  ERROR = 'Server Internal Error',
  SUCCESS = 'Server Response Success'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  WAIT_FOR_APPROVE = 'PENDING'
}

export enum RoleName {
  ADMIN = 1,
  TEACHER = 2,
  STUDENT = 3
}

export enum Role {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export enum ErrorMessage {}

export enum EmailMessage {
  Verify_email_title = 'Verify your email to complete register account - Simple English Center Can Tho'
}
