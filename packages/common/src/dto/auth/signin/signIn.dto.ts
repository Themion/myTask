import { z } from 'zod';

const signInDTOSchema = z.object({
  email: z.string().email().max(320),
});

type SignInDTO = ReturnType<typeof signInDTOSchema.parse>;

export { signInDTOSchema };
export type { SignInDTO };
