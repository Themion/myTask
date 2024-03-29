import { z } from 'zod';
import { EMAIL_RULE } from '../../utils';

const inviteMemberDTOSchema = z.object({
  groupId: z.number().min(1),
  email: EMAIL_RULE,
});

type InviteMemberDTO = ReturnType<typeof inviteMemberDTOSchema.parse>;

export { inviteMemberDTOSchema };
export type { InviteMemberDTO };
