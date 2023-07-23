import { z } from 'zod';

const confirmSignInDTOSchema = z.object({
  uuid: z.string().uuid(),
});

type ConfirmSignInDTO = ReturnType<typeof confirmSignInDTOSchema.parse>;

export { confirmSignInDTOSchema };
export type { ConfirmSignInDTO };
