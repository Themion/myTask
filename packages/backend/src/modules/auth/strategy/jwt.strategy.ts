import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN } from '~/constants';
import { Env } from '~/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<Env>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.getAccessTokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<Env['JWT']>('JWT').privateKey,
    });
  }

  private static getAccessTokenFromCookie(request: Request) {
    return request.cookies[ACCESS_TOKEN];
  }

  async validate(payload: any) {
    return payload.email;
  }
}
