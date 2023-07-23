import { z } from 'zod';

const requestSignInDTOSchema = z.object({
  email: z.string().email().max(320),
});

type RequestSignInDTO = ReturnType<typeof requestSignInDTOSchema.parse>;

export { requestSignInDTOSchema };
export type { RequestSignInDTO };
