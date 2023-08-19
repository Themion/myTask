import { z } from 'zod';

const createGroupDTOSchema = z.object({
  name: z.string(),
});

type CreateGroupDTO = z.infer<typeof createGroupDTOSchema>;

export { createGroupDTOSchema };
export type { CreateGroupDTO };
