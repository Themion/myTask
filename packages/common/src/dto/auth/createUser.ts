import { z } from 'zod';

const createUserDTO = z.object({
  email: z.string().email().max(320),
});

type CreateUserDTO = ReturnType<typeof createUserDTO.parse>;

export { createUserDTO, CreateUserDTO };
