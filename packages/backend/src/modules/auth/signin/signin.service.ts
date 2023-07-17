import { ConfirmSignInDTO, RequestSignInDTO } from '@my-task/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SignInService {
  private readonly uuidToEmail = new Map<string, RequestSignInDTO>();
  private readonly emailToUUID = new Map<string, string>();

  async requestSignIn(dto: RequestSignInDTO) {
    const uuid = uuidv4();

    this.uuidToEmail.set(uuid, dto);
    this.emailToUUID.set(dto.email, uuid);

    return uuid;
  }

  async confirmSignIn(dto: ConfirmSignInDTO) {
    if (!this.uuidToEmail.has(dto.uuid))
      throw new BadRequestException('UUID cannot be found: Wrong DTO!');

    const data = this.uuidToEmail.get(dto.uuid) as RequestSignInDTO;
    this.uuidToEmail.delete(dto.uuid);
    this.emailToUUID.delete(data.email);

    return data;
  }
}
