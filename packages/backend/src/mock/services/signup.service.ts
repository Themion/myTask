import { ConfirmSignUpDTO, RequestSignUpDTO, User } from '@my-task/common';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const mockSignUpService = async () => ({
  uuidToEmail: new Map<string, RequestSignUpDTO>(),
  emailToUuid: new Map<string, string>(),
  requestSignUpUser(dto: RequestSignUpDTO) {
    const uuid = uuidv4();
    this.uuidToEmail.set(uuid, dto);
    this.emailToUuid.set(dto.email, uuid);
    return uuid;
  },
  confirmSignUpUser(dto: ConfirmSignUpDTO) {
    if (!this.uuidToEmail.has(dto.uuid))
      throw new BadRequestException('UUID cannot be found: Wrong DTO!');
    const data = this.uuidToEmail.get(dto.uuid) as RequestSignUpDTO;

    const user: User = { id: Math.floor(Math.random() * 10), ...data };
    return user;
  },
});

type MockSignUpService = Awaited<ReturnType<typeof mockSignUpService>>;

export { mockSignUpService };
export type { MockSignUpService };
