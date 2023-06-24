import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { Env } from '~/types';

@Injectable()
export class DatabaseProvider {
  private readonly _pool;

  constructor(configService: ConfigService<Env>) {
    const config = {
      host: configService.getOrThrow<Env['DB_HOST']>('DB_HOST'),
      port: configService.getOrThrow<Env['DB_PORT']>('DB_PORT'),
      database: configService.getOrThrow<Env['DB_DB']>('DB_DB'),
      user: configService.getOrThrow<Env['DB_USER']>('DB_USER'),
      password: configService.getOrThrow<Env['DB_PASSWORD']>('DB_PASSWORD'),
    };

    this._pool = new Pool(config);
  }

  get pool() {
    return this._pool;
  }
}
