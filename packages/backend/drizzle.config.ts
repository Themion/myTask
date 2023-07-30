import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import type { Config } from 'drizzle-kit';
import { envPaths } from '~/constants';
import { validate } from '~/env';

envPaths.forEach((path) => expand(config({ path })));

const env = validate(process.env);

export default {
  schema: '../common/src/database/schema.ts',
  out: './drizzle',
  dbCredentials: env.DB,
} satisfies Config;
