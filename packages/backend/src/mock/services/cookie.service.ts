import { dateAfter } from '@my-task/common';
import { CookieOptions } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';
import { CookieSettings } from '~/types';

const mockCookieService = () => ({
  getExpirationDate(lifeSpan: number) {
    return dateAfter(lifeSpan);
  },
  tokenOption(lifeSpan: number): CookieOptions {
    return {
      maxAge: this.getExpirationDate(lifeSpan).getTime(),
      httpOnly: true,
    };
  },
  setCookie(email: string): CookieSettings {
    const payload = Buffer.from(JSON.stringify({ email })).toString('base64');
    const accessToken = `a.${payload}.a`;
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
  },
});

type MockCookieService = ReturnType<typeof mockCookieService>;

export { mockCookieService };
export type { MockCookieService };
