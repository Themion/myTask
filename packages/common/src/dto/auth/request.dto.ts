import { z } from 'zod';
import { EMAIL_RULE } from '../../utils';

const requestAuthDTOSchema = z.object({
  email: EMAIL_RULE,
});

type RequestAuthDTO = ReturnType<typeof requestAuthDTOSchema.parse>;

export { requestAuthDTOSchema };
export type { RequestAuthDTO };
