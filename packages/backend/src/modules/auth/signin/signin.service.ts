import { RequestSignInDTO } from '@my-task/common';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SignInService {
  private readonly uuidToEmail = new Map<string, RequestSignInDTO>();
  private readonly emailToUUID = new Map<string, string>();

  async requestSignIn(dto: RequestSignInDTO) {
    if (this.emailToUUID.has(dto.email)) return this.emailToUUID.get(dto.email) as string;

    const uuid = uuidv4();

    this.uuidToEmail.set(uuid, dto);
    this.emailToUUID.set(dto.email, uuid);

    return uuid;
  }
}
