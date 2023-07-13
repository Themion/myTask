import { z } from 'zod';

const requestJoinUserDTO = z.object({
  email: z.string().email().max(320),
});

type RequestJoinUserDTO = ReturnType<typeof requestJoinUserDTO.parse>;

export { requestJoinUserDTO };
export type { RequestJoinUserDTO };
