import { z } from 'zod';

const leaveMemberDTOSchema = z.object({
  groupId: z.number().min(1),
});

type LeaveMemberDTO = ReturnType<typeof leaveMemberDTOSchema.parse>;

export { leaveMemberDTOSchema };
export type { LeaveMemberDTO };
