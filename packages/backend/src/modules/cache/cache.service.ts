import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { Env } from '~/types';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly redisClient;
  private readonly NODE_ENV;
  private readonly timeoutIdArr: NodeJS.Timeout[];

  constructor(configService: ConfigService<Env>) {
    const redis = configService.getOrThrow<Env['REDIS']>('REDIS');
    this.redisClient = createClient(redis);
    this.timeoutIdArr = [];

    this.NODE_ENV = configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV');
  }

  async onModuleInit() {
    const connection = this.redisClient.connect();
    if (this.NODE_ENV === 'testing') await this.redisClient.flushAll();
    return connection;
  }

  onModuleDestroy() {
    this.timeoutIdArr.forEach((id) => clearTimeout(id));
    return this.redisClient.disconnect();
  }

  toSet(tableName: string) {
    return {
      set: async (value: string, expiresAt?: Date) => {
        const result = this.redisClient.sAdd(tableName, value);
        if (expiresAt) {
          const ETA = expiresAt.getTime() - new Date().getTime();
          const timeout = setTimeout(() => this.redisClient.sRem(tableName, value), ETA);
          this.timeoutIdArr.push(timeout);
        }
        return result;
      },
      get: async () => {
        return new Set(await this.redisClient.sMembers(tableName));
      },
      has: (value: string) => {
        return this.redisClient.sIsMember(tableName, value);
      },
      del: (value: string) => {
        return this.redisClient.sRem(tableName, value);
      },
    };
  }

  toHash(tableName: string) {
    return {
      set: async (field: string, value: string, expiresAt?: Date) => {
        const result = this.redisClient.hSet(tableName, field, value);
        if (expiresAt) {
          const ETA = expiresAt.getTime() - new Date().getTime();
          const timeout = setTimeout(() => this.redisClient.hDel(tableName, field), ETA);
          this.timeoutIdArr.push(timeout);
        }
        return result;
      },
      get: (field: string) => {
        return this.redisClient.hGet(tableName, field);
      },
      has: (field: string) => {
        return this.redisClient.hExists(tableName, field);
      },
      del: (field: string) => {
        return this.redisClient.hDel(tableName, field);
      },
    };
  }
}
