import { z } from 'zod';

const refreshedDTOSchema = z.object({
  refreshed: z.boolean(),
});

type RefreshedDTO = ReturnType<typeof refreshedDTOSchema.parse>;

export { refreshedDTOSchema };
export type { RefreshedDTO };
