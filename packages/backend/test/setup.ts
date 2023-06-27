import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { envPaths } from '~/constants';

envPaths.forEach((path) => expand(config({ path })));
