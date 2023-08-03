import { relation, schema } from '@my-task/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'node:path';
import { DatabaseProvider } from '~/modules/database/database.provider';
import { Env } from '~/types';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly _db;
  private readonly NODE_ENV;

  constructor(databaseProvider: DatabaseProvider, configService: ConfigService) {
    this._db = drizzle(databaseProvider.pool, {
      schema: {
        ...schema,
        ...relation,
      },
    });

    this.NODE_ENV = configService.getOrThrow<Env['NODE_ENV']>('NODE_ENV');
  }

  async onModuleInit() {
    const migrationsFolder = resolve(process.cwd(), 'drizzle');

    if (this.NODE_ENV === 'testing')
      await Promise.allSettled(
        Object.values(schema).map((table) =>
          // this._db.execute(sql`drop table if exists public.${table}`),
          this._db.delete(table).returning(),
        ),
      );

    await migrate(this.db, { migrationsFolder });
  }

  get db() {
    return this._db;
  }
}
