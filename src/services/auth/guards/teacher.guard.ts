import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AdminDtoResponse } from 'src/modules/admin/dto/adminDto';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/global/globalEnum';

@Injectable()
export class TeacherGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: AdminDtoResponse = await this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY
      });

      request['current_user'] = payload;

      const currentPermission = await bcrypt.compare('' + Role.TEACHER, payload.role);

      return currentPermission;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization
      ? request.headers.authorization.split(' ')
      : [];
    return type === 'Bearer' ? token : undefined;
  }
}
