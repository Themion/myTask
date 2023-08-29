import { z } from 'zod';
import { STRING_RULE } from '../../utils';

const groupInfoDTOSchema = z.object({
  id: z.number(),
  name: STRING_RULE,
});

type GroupInfoDTO = z.infer<typeof groupInfoDTOSchema>;

export { groupInfoDTOSchema };
export type { GroupInfoDTO };
