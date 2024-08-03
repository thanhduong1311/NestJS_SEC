import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthDtoResponse } from '../dto/authDto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SimpleEnglishCenter'
    });
  }

  validate(payload: any): AuthDtoResponse {
    const { password, ...user } = payload;
    !password;
    return user;
  }
}
