import { z } from 'zod';

const requestAuthDTOSchema = z.object({
  email: z.string().email().max(320),
});

type RequestAuthDTO = ReturnType<typeof requestAuthDTOSchema.parse>;

export { requestAuthDTOSchema };
export type { RequestAuthDTO };
