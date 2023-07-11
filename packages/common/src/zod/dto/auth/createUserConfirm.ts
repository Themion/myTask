import { z } from 'zod';

const createUserConfirmDTO = z.object({
  uuid: z.string().uuid(),
});

type CreateUserConfirmDTO = ReturnType<typeof createUserConfirmDTO.parse>;

export { createUserConfirmDTO, CreateUserConfirmDTO };
