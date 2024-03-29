import { SECOND, dateAfter } from '@my-task/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  CACHE_TABLE_NAME,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';
import { CacheService } from '~/modules/cache/cache.service';
import { CookieSettings } from '~/types';

@Injectable()
export class CookieService {
  private readonly RT2Email;

  constructor(private readonly jwtService: JwtService, cacheService: CacheService) {
    this.RT2Email = cacheService.toHash(CACHE_TABLE_NAME.RT2Email);
  }

  private tokenOption(lifeSpan: number): CookieOptions & { maxAge: number } {
    return {
      maxAge: lifeSpan,
      httpOnly: true,
    };
  }

  async setCookie(email: string): Promise<CookieSettings> {
    const payload = { email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_LIFE_SPAN / SECOND,
    });

    const refreshToken = uuidv4();
    const refreshTokenOption = this.tokenOption(REFRESH_TOKEN_LIFE_SPAN);
    const refreshTokenExpireDate = dateAfter(refreshTokenOption.maxAge);

    await this.RT2Email.set(refreshToken, email, refreshTokenExpireDate);

    return {
      [ACCESS_TOKEN]: {
        val: accessToken,
        options: this.tokenOption(ACCESS_TOKEN_LIFE_SPAN),
      },
      [REFRESH_TOKEN]: {
        val: refreshToken,
        options: refreshTokenOption,
      },
    };
  }
}
