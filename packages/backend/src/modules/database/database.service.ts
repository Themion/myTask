import { schema } from '@my-task/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'node:path';
import { DatabaseProvider } from '~/modules/database/database.provider';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly _db;

  constructor(databaseProvider: DatabaseProvider) {
    this._db = drizzle(databaseProvider.pool, { schema });
  }

  async onModuleInit() {
    const migrationsFolder = resolve(process.cwd(), 'drizzle');
    await migrate(this.db, { migrationsFolder });
  }

  get db() {
    return this._db;
  }
}
