import { RequestSignInDTO } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';

const mockSignInService = async () => ({
  uuidToEmail: new Map<string, RequestSignInDTO>(),
  emailToUuid: new Map<string, string>(),
  requestSignIn(dto: RequestSignInDTO) {
    const uuid = uuidv4();
    this.uuidToEmail.set(uuid, dto);
    this.emailToUuid.set(dto.email, uuid);
    return uuid;
  },
});

type MockSignInService = Awaited<ReturnType<typeof mockSignInService>>;

export { mockSignInService };
export type { MockSignInService };
