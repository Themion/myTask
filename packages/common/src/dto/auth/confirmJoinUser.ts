import { z } from 'zod';

const confirmJoinUserDTO = z.object({
  uuid: z.string().uuid(),
});

type ConfirmJoinUserDTO = ReturnType<typeof confirmJoinUserDTO.parse>;

export { confirmJoinUserDTO };
export type { ConfirmJoinUserDTO };
