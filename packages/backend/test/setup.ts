import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { resolve } from 'path';

const path = resolve(process.cwd(), '..', '..', '.env');
expand(config({ path }));
