import { UUID_RULE } from '@my-task/common';
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_LIFE_SPAN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_LIFE_SPAN,
} from '~/constants';
import { mockAuthModule, validEmail } from '~/mock';
import { CookieService } from '~/modules/auth/cookie.service';
import { CacheService } from '~/modules/cache/cache.service';
import { CookieSettings } from '~/types';

describe('CookieService', () => {
  let service: CookieService;
  let email: string;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module = await mockAuthModule({});
    service = module.get<CookieService>(CookieService);
    cacheService = module.get<CacheService>(CacheService);

    await cacheService.onModuleInit();

    email = validEmail;
  });

  afterEach(async () => cacheService.onModuleDestroy());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setCookie', () => {
    it('should work (validation will be in controller)', async () => {
      await expect(service.setCookie(email)).resolves.not.toThrow();
    });

    describe('should create token', () => {
      let cookieSettings: CookieSettings;

      const getJwtPayload = (jwt: string) => {
        const payloadAsBase64 = jwt.split('.')[1];
        const decodedPayload = Buffer.from(payloadAsBase64, 'base64').toString('utf-8');
        return JSON.parse(decodedPayload);
      };

      beforeEach(async () => {
        cookieSettings = await service.setCookie(email);
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

        expect(maxAge).toBeDefined();
        expect(maxAge as number).toEqual(ACCESS_TOKEN_LIFE_SPAN);
      });

      it('refresh token', () => {
        const refreshToken = cookieSettings[REFRESH_TOKEN];
        const { val, options } = refreshToken;
        const { httpOnly, maxAge } = options;

        expect(refreshToken).toBeDefined();

        expect(val).toBeDefined();
        expect(UUID_RULE.safeParse(val).success).toEqual(true);

        expect(httpOnly).toEqual(true);

        expect(maxAge).toBeDefined();
        expect(maxAge as number).toEqual(REFRESH_TOKEN_LIFE_SPAN);
      });
    });
  });
});
