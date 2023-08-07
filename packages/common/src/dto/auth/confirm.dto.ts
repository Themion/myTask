import { z } from 'zod';

const confirmAuthDTOSchema = z.object({
  uuid: z.string().uuid(),
});

type ConfirmAuthDTO = ReturnType<typeof confirmAuthDTOSchema.parse>;

export { confirmAuthDTOSchema };
export type { ConfirmAuthDTO };
