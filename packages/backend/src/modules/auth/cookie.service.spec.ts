import { Response } from 'express';
import { MockResponse, createResponse } from 'node-mocks-http';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';
import { mockAuthModule } from '~/mock';
import { CookieService } from '~/modules/auth/cookie.service';

describe('CookieService', () => {
  let service: CookieService;
  let email: string;
  let response: MockResponse<Response>;

  beforeEach(async () => {
    const module = await mockAuthModule();
    service = module.get<CookieService>(CookieService);

    response = createResponse();
    email = 'test@example.com';
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setCookie', () => {
    it('should work (validation will be in controller)', () => {
      expect(() => service.setCookie(email, response)).not.toThrow();
    });

    describe('should create token', () => {
      let before: number;
      let after: number;

      beforeEach(() => {
        before = new Date().getTime();
        service.setCookie(email, response);
        after = new Date().getTime();
      });

      it('access token', () => {
        const accessToken = response.cookies[ACCESS_TOKEN];
        const lifeSpan = ACCESS_TOKEN_LIFE_SPAN;

        expect(accessToken).toBeDefined();
        expect(accessToken.options.httpOnly).toEqual(true);

        expect(after - before).toBeLessThan(1000);
        expect(accessToken.options.maxAge - before).toBeGreaterThanOrEqual(lifeSpan);
        expect(accessToken.options.maxAge - after).toBeLessThanOrEqual(lifeSpan);
      });

      it('refresh token', () => {
        const refreshToken = response.cookies[REFRESH_TOKEN];
        const lifeSpan = REFRESH_TOKEN_LIFE_SPAN;

        expect(refreshToken).toBeDefined();
        expect(refreshToken.options.httpOnly).toEqual(true);

        expect(after - before).toBeLessThan(1000);
        expect(refreshToken.options.maxAge - before).toBeGreaterThanOrEqual(lifeSpan);
        expect(refreshToken.options.maxAge - after).toBeLessThanOrEqual(lifeSpan);
      });
    });
  });
});
