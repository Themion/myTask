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
    const { uuid } = dto;

    if (!this.uuidToEmail.has(uuid))
      throw new BadRequestException('UUID cannot be found: Wrong DTO!');

    return this.uuidToEmail.get(uuid) as RequestSignUpDTO;
  },
});

type MockSignInService = Awaited<ReturnType<typeof mockSignInService>>;

export { mockSignInService };
export type { MockSignInService };
