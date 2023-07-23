import { z } from 'zod';

const requestSignUpDTOSchema = z.object({
  email: z.string().email().max(320),
});

type RequestSignUpDTO = ReturnType<typeof requestSignUpDTOSchema.parse>;

export { requestSignUpDTOSchema };
export type { RequestSignUpDTO };
