import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';
import { CookieSettings } from '~/types';

@Injectable()
export class CookieService {
  constructor(private readonly jwtService: JwtService) {}

  private getExpirationDate(lifeSpan: number) {
    return new Date(new Date().getTime() + lifeSpan);
  }

  private tokenOption(lifeSpan: number): CookieOptions {
    return {
      maxAge: this.getExpirationDate(lifeSpan).getTime(),
      httpOnly: true,
    };
  }

  setCookie(email: string): CookieSettings {
    const payload = { email };

    const accessToken = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_LIFE_SPAN });
    const refreshToken = uuidv4();

    return {
      [ACCESS_TOKEN]: {
        val: `Bearer ${accessToken}`,
        options: this.tokenOption(ACCESS_TOKEN_LIFE_SPAN),
      },
      [REFRESH_TOKEN]: {
        val: refreshToken,
        options: this.tokenOption(REFRESH_TOKEN_LIFE_SPAN),
      },
    };
  }
}
