import { z } from 'zod';
const STRING_RULE = z.string().min(1);
export default STRING_RULE;
