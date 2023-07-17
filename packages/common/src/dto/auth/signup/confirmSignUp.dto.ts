import { z } from 'zod';

const confirmSignUpDTOSchema = z.object({
  uuid: z.string().uuid(),
});

type ConfirmSignUpDTO = ReturnType<typeof confirmSignUpDTOSchema.parse>;

export { confirmSignUpDTOSchema };
export type { ConfirmSignUpDTO };
