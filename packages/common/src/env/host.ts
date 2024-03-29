import { ZodIssueCode, z } from 'zod';
import { STRING_RULE } from '../utils';

const IP_RULE = STRING_RULE.ip().refine(
  (ip) => ip.split('.')[0] !== '0',
  ZodIssueCode.invalid_string,
);
const LOCALHOST_RULE = z.literal('localhost');
const DOCKERHOST_RULE = z.literal('host.docker.internal');

const HOST_RULE = z.union([IP_RULE, LOCALHOST_RULE, DOCKERHOST_RULE]);
export default HOST_RULE;
