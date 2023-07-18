import { CookieOptions, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';

const mockCookieService = () => ({
  getExpirationDate(lifeSpan: number) {
    return new Date(new Date().getTime() + lifeSpan);
  },
  tokenOption(lifeSpan: number): CookieOptions {
    return {
      maxAge: this.getExpirationDate(lifeSpan).getTime(),
      httpOnly: true,
    };
  },
  setCookie(_: string, res: Response) {
    const accessToken = uuidv4();
    const refreshToken = uuidv4();

    res.cookie(ACCESS_TOKEN, accessToken, this.tokenOption(ACCESS_TOKEN_LIFE_SPAN));
    res.cookie(REFRESH_TOKEN, refreshToken, this.tokenOption(REFRESH_TOKEN_LIFE_SPAN));
  },
});

type MockCookieService = ReturnType<typeof mockCookieService>;

export { mockCookieService };
export type { MockCookieService };
