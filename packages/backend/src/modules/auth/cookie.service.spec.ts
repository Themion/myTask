import { z } from 'zod';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';
import { mockAuthModule } from '~/mock';
import { CookieService } from '~/modules/auth/cookie.service';
import { CookieSettings } from '~/types';

describe('CookieService', () => {
  let service: CookieService;
  let email: string;

  beforeEach(async () => {
    const module = await mockAuthModule();
    service = module.get<CookieService>(CookieService);

    email = 'test@example.com';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setCookie', () => {
    it('should work (validation will be in controller)', () => {
      expect(() => service.setCookie(email)).not.toThrow();
    });

    describe('should create token', () => {
      let before: number;
      let after: number;
      let cookieSettings: CookieSettings;

      const getJwtPayload = (jwt: string) => {
        const payloadAsBase64 = jwt.split('.')[1];
        const decodedPayload = Buffer.from(payloadAsBase64, 'base64').toString('utf-8');
        return JSON.parse(decodedPayload);
      };

      beforeEach(() => {
        before = new Date().getTime();
        cookieSettings = service.setCookie(email);
        after = new Date().getTime();
      });

      it('access token', () => {
        const accessToken = cookieSettings[ACCESS_TOKEN];
        const { val, options } = accessToken;
        const payload = getJwtPayload(val);
        const { httpOnly, maxAge } = options;

        expect(accessToken).toBeDefined();

        expect(payload).toBeDefined();
        expect(payload).toHaveProperty('email');
        expect(payload.email).toEqual(email);

        expect(httpOnly).toEqual(true);

        expect(after - before).toBeLessThan(1000);
        expect(maxAge).toBeDefined();
        expect((maxAge as number) - before).toBeGreaterThanOrEqual(ACCESS_TOKEN_LIFE_SPAN);
        expect((maxAge as number) - after).toBeLessThanOrEqual(ACCESS_TOKEN_LIFE_SPAN);
      });

      it('refresh token', () => {
        const refreshToken = cookieSettings[REFRESH_TOKEN];
        const { val, options } = refreshToken;
        const { httpOnly, maxAge } = options;

        expect(refreshToken).toBeDefined();

        expect(val).toBeDefined();
        expect(z.string().uuid().safeParse(val).success).toEqual(true);

        expect(httpOnly).toEqual(true);

        expect(after - before).toBeLessThan(1000);
        expect(maxAge).toBeDefined();
        expect((maxAge as number) - before).toBeGreaterThanOrEqual(REFRESH_TOKEN_LIFE_SPAN);
        expect((maxAge as number) - after).toBeLessThanOrEqual(REFRESH_TOKEN_LIFE_SPAN);
      });
    });
  });
});
