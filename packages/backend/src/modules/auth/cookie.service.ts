import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';

@Injectable()
export class CookieService {
  private readonly accessTokenToEmail: Map<string, string>;
  private readonly refreshTokenToAccessToken: Map<string, string>;

  constructor() {
    this.accessTokenToEmail = new Map();
    this.refreshTokenToAccessToken = new Map();
  }

  private getExpirationDate(lifeSpan: number) {
    return new Date(new Date().getTime() + lifeSpan);
  }

  private tokenOption(lifeSpan: number): CookieOptions {
    return {
      maxAge: this.getExpirationDate(lifeSpan).getTime(),
      httpOnly: true,
    };
  }

  setCookie(email: string, res: Response) {
    const accessToken = uuidv4();
    const refreshToken = uuidv4();

    this.accessTokenToEmail.set(accessToken, email);
    this.refreshTokenToAccessToken.set(refreshToken, accessToken);

    res.cookie(ACCESS_TOKEN, accessToken, this.tokenOption(ACCESS_TOKEN_LIFE_SPAN));
    res.cookie(REFRESH_TOKEN, refreshToken, this.tokenOption(REFRESH_TOKEN_LIFE_SPAN));
  }
}
