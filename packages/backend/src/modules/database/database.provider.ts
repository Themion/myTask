import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolConfig } from 'pg';
import { Env } from '~/types';

@Injectable()
export class DatabaseProvider {
  private readonly _pool;

  constructor(configService: ConfigService<Env>) {
    const config: PoolConfig = configService.getOrThrow<Env['DB']>('DB');
    this._pool = new Pool(config);
  }

  get pool() {
    return this._pool;
  }
}
