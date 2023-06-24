import { ZodIssueCode, z } from 'zod';

const HOST_RULE = z.union([
  z
    .string()
    .ip()
    .refine((ip) => ip.split('.')[0] !== '0', ZodIssueCode.invalid_string),
  z.literal('localhost'),
]);
export default HOST_RULE;
