import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';
import { Env } from '~/types';

@Injectable()
export class DatabaseProvider {
  private readonly _pool;

  constructor(configService: ConfigService<Env>) {
    const config: PoolConfig = configService.getOrThrow<Env['DB']>('DB');
    const NODE_ENV: string = configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV');
    if (NODE_ENV === 'testing') config.max = 10000;
    this._pool = new Pool(config);
  }

  get pool() {
    return this._pool;
  }
}
