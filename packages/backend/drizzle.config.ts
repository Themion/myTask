import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import type { Config } from 'drizzle-kit';
import { envPaths } from '~/constants';
import { validate } from '~/env';

envPaths.forEach((path) => expand(config({ path })));

const env = validate(process.env);

export default {
  schema: '../common/src/database/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    host: env.HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DB,
  },
} satisfies Config;
