import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import type { Config } from 'drizzle-kit';
import { resolve } from 'path';
import { validate } from '~/env';

const path = resolve(process.cwd(), '..', '..', '.env');
expand(config({ path }));

const env = validate(process.env);

export default {
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DB,
  },
} satisfies Config;
