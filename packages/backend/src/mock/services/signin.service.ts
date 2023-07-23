import { ConfirmSignInDTO, RequestSignInDTO, RequestSignUpDTO } from '@my-task/common';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const mockSignInService = async () => ({
  uuidToEmail: new Map<string, RequestSignInDTO>(),
  emailToUuid: new Map<string, string>(),
  async requestSignIn(dto: RequestSignInDTO) {
    const uuid = uuidv4();
    this.uuidToEmail.set(uuid, dto);
    this.emailToUuid.set(dto.email, uuid);
    return uuid;
  },
  async confirmSignIn(dto: ConfirmSignInDTO) {
    if (!this.uuidToEmail.has(dto.uuid))
      throw new BadRequestException('UUID cannot be found: Wrong DTO!');
    const data = this.uuidToEmail.get(dto.uuid) as RequestSignUpDTO;

    return data;
  },
});

type MockSignInService = Awaited<ReturnType<typeof mockSignInService>>;

export { mockSignInService };
export type { MockSignInService };
