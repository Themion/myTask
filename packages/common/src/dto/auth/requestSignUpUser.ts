import { z } from 'zod';

const requestSignUpUserDTO = z.object({
  email: z.string().email().max(320),
});

type RequestSignUpUserDTO = ReturnType<typeof requestSignUpUserDTO.parse>;

export { requestSignUpUserDTO };
export type { RequestSignUpUserDTO };
