import { z } from 'zod';

const NUMERIC_STRING_RULE = z.string().transform(Number);
export default NUMERIC_STRING_RULE;
