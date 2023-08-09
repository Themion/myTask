import { ConfirmAuthDTO, RequestAuthDTO } from '@my-task/common';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { mockCookieService } from '~/mock/services/cookie.service';

const mockAuthService = async () => ({
  cookieService: mockCookieService(),
  uuidToEmail: new Map<string, string>(),
  emailToUuid: new Map<string, string>(),

  async request(dto: RequestAuthDTO) {
    const { email } = dto;
    const uuid = uuidv4();

    this.uuidToEmail.set(uuid, email);
    this.emailToUuid.set(email, uuid);

    return uuid;
  },
  async confirm(dto: ConfirmAuthDTO) {
    const { uuid } = dto;
    const email = this.uuidToEmail.get(uuid);

    if (!email) throw new BadRequestException('UUID cannot be found: Wrong DTO!');

    return { email };
  },

  refresh(_: string) {
    const email = 'test@email.com';
    return this.cookieService.setCookie(email);
  },

  async removeRefreshToken(_: string) {
    return 1;
  },
});

type MockAuthService = Awaited<ReturnType<typeof mockAuthService>>;

export { mockAuthService };
export type { MockAuthService };
