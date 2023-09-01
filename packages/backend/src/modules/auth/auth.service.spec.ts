import { RequestAuthDTO } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { ACCESS_TOKEN, CACHE_TABLE_NAME, REFRESH_TOKEN } from '~/constants';
import {
  MockCacheService,
  MockGroupService,
  mockAuthModule,
  mockCacheService,
  mockDatabaseModule,
  mockGroupService,
  validEmail,
} from '~/mock';
import { AuthService } from '~/modules/auth/auth.service';
import { CacheService } from '~/modules/cache/cache.service';
import { DatabaseService } from '~/modules/database/database.service';

describe('AuthService', () => {
  let service: AuthService;
  let databaseService: DatabaseService;
  let cacheService: MockCacheService;

  let email: string;
  let uuid: string;
  let userToAdd: RequestAuthDTO;

  let RT2Email: ReturnType<CacheService['toHash']>;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    let groupService: MockGroupService;
    [cacheService, groupService] = await Promise.all([mockCacheService(), mockGroupService()]);

    const module = await mockAuthModule({ databaseService, cacheService, groupService });
    service = module.get<AuthService>(AuthService);

    RT2Email = cacheService.toHash(CACHE_TABLE_NAME.RT2Email);
  });

  afterEach(async () => cacheService.onModuleDestroy());

  beforeEach(() => {
    email = validEmail;
    userToAdd = { email };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('request', () => {
    it('should work (validation will be in controller)', async () => {
      const result = await service.request(userToAdd);
      const parsedResult = z.string().uuid().safeParse(result);
      expect(parsedResult.success).toEqual(true);
    });
  });

  describe('confirm (validation will be in controller)', () => {
    beforeEach(async () => {
      uuid = await service.request(userToAdd);
    });

    it('should work', async () => {
      let result;
      expect((result = await service.confirm({ uuid }))).toBeDefined();
      expect(result.email).toEqual(email);
    });

    describe('should throw error when', () => {
      it('non-existing uuid', async () => {
        uuid = uuidv4();
        await expect(async () => service.confirm({ uuid })).rejects.toThrow();
      });

      it('pass duplicated uuid', async () => {
        await service.confirm({ uuid });
        await expect(async () => service.confirm({ uuid })).rejects.toThrow();
      });

      it('pass outdated uuid', async () => {
        const newUUID = await service.request(userToAdd);
        await expect(async () => service.confirm({ uuid })).rejects.toThrow();
        await expect(service.confirm({ uuid: newUUID })).resolves.not.toThrow();
      });
    });
  });

  describe('refresh', () => {
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
        await expect(service.refresh(uuid)).rejects.toThrow();
      });
    });
  });

  describe('removeRefreshToken', () => {
    beforeEach(async () => {
      uuid = uuidv4();
    });

    it('should work', async () => {
      await RT2Email.set(uuid, email);

      expect(await RT2Email.get(uuid)).toBeDefined();
      await expect(service.removeRefreshToken(uuid)).resolves.not.toThrow();
      expect(await RT2Email.get(uuid)).toBeNull();
    });

    it('should not throw when uuid not exists', async () => {
      expect(await RT2Email.get(uuid)).toBeNull();
      await expect(service.removeRefreshToken(uuid)).resolves.not.toThrow();
    });
  });
});
