import { ZodIssueCode, z } from 'zod';

const NUMERIC_STRING_RULE = z
  .string()
  .transform(Number)
  .refine((val) => !isNaN(val), ZodIssueCode.invalid_string);
export default NUMERIC_STRING_RULE;
