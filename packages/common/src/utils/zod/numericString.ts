import { ZodIssueCode } from 'zod';
import STRING_RULE from './string';

const NUMERIC_STRING_RULE = STRING_RULE.transform(Number).refine(
  (val) => !isNaN(val),
  ZodIssueCode.invalid_string,
);
export default NUMERIC_STRING_RULE;
