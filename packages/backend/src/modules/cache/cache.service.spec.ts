import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { mockCacheModule } from '~/mock';
import { CacheService } from '~/modules/cache/cache.service';
import { Env } from '~/types';

type SetType = ReturnType<CacheService['toSet']>;
type HashType = ReturnType<CacheService['toHash']>;
type Client = ReturnType<typeof createClient>;

describe('CacheService', () => {
  let service: CacheService;
  let redisClient: Client;

  const delay = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(true), ms);
    });

  beforeAll(async () => {
    const module = await mockCacheModule();
    const configService = module.get<ConfigService<Env>>(ConfigService);
    redisClient = createClient(configService.getOrThrow<Env['REDIS']>('REDIS'));

    await redisClient.connect();
  });

  beforeEach(async () => {
    const module = await mockCacheModule();
    service = module.get<CacheService>(CacheService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  afterAll(async () => {
    await redisClient.disconnect();
  });

  describe('toSet', () => {
    let set: SetType;
    const tableName = 'toSet';

    beforeEach(() => {
      set = service.toSet(tableName);
    });

    it('should be defined', () => {
      expect(set).toBeDefined();
    });

    describe('toSet', () => {
      let value: string;

      describe('set', () => {
        beforeEach(() => {
          value = 'testSet';
        });

        it('should add value', async () => {
          const length = await redisClient.sCard(tableName);

          expect(await set.set(value)).toEqual(1);
          const members = await redisClient.sMembers(tableName);
          expect(members.length).toEqual(length + 1);
          expect(members.includes(value)).toEqual(true);
        });

        it('should not add duplicate value', async () => {
          const length = await redisClient.sCard(tableName);

          expect(await set.set(value)).toEqual(1);
          expect(await set.set(value)).toEqual(0);
          expect(await redisClient.sCard(tableName)).toEqual(length + 1);
          expect(await redisClient.sIsMember(tableName, value)).toEqual(true);
        });

        it('should expire value', async () => {
          const delayTime = 1000;
          const expiresAt = new Date(new Date().getTime() + delayTime);

          await set.set(value, expiresAt);
          expect(await redisClient.sIsMember(tableName, value)).toEqual(true);

          await delay(delayTime);
          expect(await redisClient.sIsMember(tableName, value)).toEqual(false);
        });
      });

      describe('get', () => {
        beforeEach(async () => {
          value = 'testGet';
          await redisClient.sAdd(tableName, value);
        });

        it('should get Set of values', async () => {
          expect([...(await set.get())]).toEqual([value]);
        });
      });

      describe('has', () => {
        beforeEach(async () => {
          value = 'testHas';
          await redisClient.sAdd(tableName, value);
        });

        it('should be able to find existing value', async () => {
          expect(await set.has(value)).toEqual(true);
        });

        it('should not be able to find not existing value', async () => {
          value = 'this is not in set';
          expect(await set.has(value)).toEqual(false);
        });
      });

      describe('del', () => {
        beforeEach(async () => {
          value = 'testDel';
          await redisClient.sAdd(tableName, value);
        });

        it('should delete existing value', async () => {
          const length = await redisClient.sCard(tableName);

          expect(await set.del(value)).toEqual(1);
          const members = await redisClient.sMembers(tableName);
          expect(members.length).toEqual(length - 1);
          expect(members.includes(value)).toEqual(false);
        });

        it('should ignore non-existing value', async () => {
          value = 'this is not in set';
          const length = await redisClient.sCard(tableName);

          expect(await set.del(value)).toEqual(0);
          const members = await redisClient.sMembers(tableName);
          expect(members.length).toEqual(length);
        });
      });
    });
  });

  describe('toHash', () => {
    let hash: HashType;
    let value: string;
    let field: string;

    const tableName = 'toHash';

    beforeEach(() => {
      hash = service.toHash(tableName);
    });

    it('should be defined', () => {
      expect(hash).toBeDefined();
    });

    describe('set', () => {
      beforeEach(() => {
        value = 'testHash';
        field = 'field1';
      });

      it('should add value', async () => {
        expect(await hash.set(field, value)).toEqual(1);
        expect(await redisClient.hGet(tableName, field)).toEqual(value);
      });

      it('should override field', async () => {
        expect(await hash.set(field, value)).toEqual(1);
        expect(await redisClient.hGet(tableName, field)).toEqual(value);

        value += 'testHash';

        expect(await hash.set(field, value)).toEqual(0);
        expect(await redisClient.hGet(tableName, field)).toEqual(value);
      });

      it('should set multiple field', async () => {
        let obj: { [key: string]: string };
        expect(await hash.set(field, value)).toEqual(1);
        obj = await redisClient.hGetAll(tableName);
        expect(JSON.stringify(obj)).toEqual(JSON.stringify({ field1: 'testHash' }));

        field = 'field2';
        value += '2';

        expect(await hash.set(field, value)).toEqual(1);
        obj = await redisClient.hGetAll(tableName);
        expect(JSON.stringify(obj)).toEqual(
          JSON.stringify({
            field1: 'testHash',
            field2: 'testHash2',
          }),
        );
      });

      it('should expire value', async () => {
        const delayTime = 1000;
        const expiresAt = new Date(new Date().getTime() + delayTime);

        const field1 = 'field1';
        const field2 = 'field2';

        await hash.set(field1, value, expiresAt);
        await hash.set(field2, value);

        expect(await redisClient.hGet(tableName, field1)).toEqual(value);
        await delay(delayTime);
        expect(await redisClient.hGet(tableName, field1)).toBeNull();
        expect(await redisClient.hGet(tableName, field2)).toEqual(value);
      });
    });

    describe('get', () => {
      beforeEach(async () => {
        value = 'testGet';
        field = 'field';
        await redisClient.hSet(tableName, field, value);
      });

      it('should get value by field', async () => {
        expect(await hash.get(field)).toEqual(value);
      });

      it('should not get value by not existing field', async () => {
        expect(await hash.get(`${field}${field}`)).toBeNull();
      });
    });

    describe('has', () => {
      beforeEach(async () => {
        value = 'testHas';
        field = 'field';
        await redisClient.hSet(tableName, field, value);
      });

      it('should be able to find existing value', async () => {
        expect(await hash.has(field)).toEqual(true);
      });

      it('should not be able to find not existing value', async () => {
        field = 'this is not in hash';
        expect(await hash.has(field)).toEqual(false);
      });
    });

    describe('del', () => {
      beforeEach(async () => {
        value = 'testHas';
        field = 'field';
        await redisClient.hSet(tableName, field, value);
      });

      it('should delete existing value', async () => {
        expect(await redisClient.hExists(tableName, field)).toEqual(true);
        expect(await hash.del(field)).toEqual(1);
        expect(await redisClient.hExists(tableName, field)).toEqual(false);
      });

      it('should ignore non-existing value', async () => {
        expect(await hash.del('this is not in hash')).toEqual(0);
        expect(await redisClient.hExists(tableName, field)).toEqual(true);
      });
    });
  });
});
