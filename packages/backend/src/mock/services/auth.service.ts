import { CreateUserConfirmDTO, CreateUserDTO, User } from '@my-task/common';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

const mockAuthService = async () => ({
  uuidToEmail: new Map<string, CreateUserDTO>(),
  emailToUuid: new Map<string, string>(),
  requestJoinUser(dto: CreateUserDTO) {
    const uuid = uuidv4();
    this.uuidToEmail.set(uuid, dto);
    this.emailToUuid.set(dto.email, uuid);
    return uuid;
  },
  confirmJoinUser(dto: CreateUserConfirmDTO) {
    if (!this.uuidToEmail.has(dto.uuid))
      throw new BadRequestException('UUID cannot be found: Wrong DTO!');
    const data = this.uuidToEmail.get(dto.uuid) as CreateUserDTO;

    const user: User = { id: Math.floor(Math.random() * 10), ...data };
    return user;
  },
});

type MockAuthService = Awaited<ReturnType<typeof mockAuthService>>;

export { mockAuthService };
export type { MockAuthService };
