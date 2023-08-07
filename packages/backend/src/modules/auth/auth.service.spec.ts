import { v4 as uuidv4 } from 'uuid';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants';
import { mockAuthModule } from '~/mock';
import { AuthService } from '~/modules/auth/auth.service';
import { CacheService } from '~/modules/cache/cache.service';

describe('AuthService', () => {
  let service: AuthService;
  let cacheService: CacheService;

  let RT2Email: ReturnType<CacheService['toHash']>;
  let uuid: string;
  let email: string;

  beforeEach(async () => {
    const module = await mockAuthModule({});
    service = module.get<AuthService>(AuthService);
    cacheService = module.get<CacheService>(CacheService);

    RT2Email = cacheService.toHash('RT2Email');

    await cacheService.onModuleInit();
  });

  beforeEach(async () => {
    email = 'test@email.com';
    uuid = uuidv4();

    await RT2Email.set(uuid, email);
  });

  afterEach(async () => cacheService.onModuleDestroy());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('removeRefreshToken', () => {
    it('should work', async () => {
      expect(await RT2Email.get(uuid)).toBeDefined();
      expect(service.removeRefreshToken(uuid)).resolves.not.toThrow();
      expect(await RT2Email.get(uuid)).toBeNull();
    });
  });

  describe('refresh', () => {
    let uuid: string;

    beforeEach(async () => {
      uuid = uuidv4();
    });

    it('should work', async () => {
      await RT2Email.set(uuid, email);
      const result = await service.refresh(uuid);

      expect(await RT2Email.get(uuid)).toBeNull();
      expect(result).toBeDefined();
      expect(result).toHaveProperty(ACCESS_TOKEN);
      expect(result).toHaveProperty(REFRESH_TOKEN);
    });

    describe('should throw error when', () => {
      it('without refresh token', async () => {
        await expect(service.refresh(uuidv4())).rejects.toThrow();
      });
    });
  });
});
