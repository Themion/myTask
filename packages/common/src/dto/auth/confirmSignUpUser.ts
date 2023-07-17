import { z } from 'zod';

const confirmSignUpUserDTO = z.object({
  uuid: z.string().uuid(),
});

type ConfirmSignUpUserDTO = ReturnType<typeof confirmSignUpUserDTO.parse>;

export { confirmSignUpUserDTO };
export type { ConfirmSignUpUserDTO };
