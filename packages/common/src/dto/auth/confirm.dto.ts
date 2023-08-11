import { z } from 'zod';
import { UUID_RULE } from '../../utils';

const confirmAuthDTOSchema = z.object({
  uuid: UUID_RULE,
});

type ConfirmAuthDTO = ReturnType<typeof confirmAuthDTOSchema.parse>;

export { confirmAuthDTOSchema };
export type { ConfirmAuthDTO };
