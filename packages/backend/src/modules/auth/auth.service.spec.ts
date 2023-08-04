import { v4 as uuidv4 } from 'uuid';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants';
import { mockAuthModule } from '~/mock';
import { AuthService } from '~/modules/auth/auth.service';
import { CacheService } from '~/modules/cache/cache.service';

describe('AuthService', () => {
  let service: AuthService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module = await mockAuthModule({});
    service = module.get<AuthService>(AuthService);
    cacheService = module.get<CacheService>(CacheService);

    await cacheService.onModuleInit();
  });

  afterEach(async () => cacheService.onModuleDestroy());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('refresh', () => {
    let uuid: string;
    let email: string;
    let RT2Email: ReturnType<CacheService['toHash']>;

    beforeEach(async () => {
      uuid = uuidv4();
      email = 'test@email.com';

      RT2Email = cacheService.toHash('RT2Email');
    });

    it('should work', async () => {
      await RT2Email.set(uuid, email);
      const result = await service.refresh(uuid);

      expect(result).toBeDefined();
      expect(result).toHaveProperty(ACCESS_TOKEN);
      expect(result).toHaveProperty(REFRESH_TOKEN);
    });

    describe('should throw error when', () => {
      it('without refresh token', async () => {
        await expect(service.refresh(uuid)).rejects.toThrow();
      });
    });
  });
});
