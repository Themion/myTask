import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'node:path';
import { DatabaseProvider } from '~/database/database.provider';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly _db;

  constructor(databaseProvider: DatabaseProvider) {
    this._db = drizzle(databaseProvider.pool, { schema });
  }

  async onModuleInit() {
    await migrate(this.db, { migrationsFolder: resolve(process.cwd(), 'drizzle') });
  }

  get db() {
    return this._db;
  }
}
