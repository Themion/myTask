import { ConfirmSignInDTO, RequestSignInDTO, users } from '@my-task/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '~/modules/database/database.service';

@Injectable()
export class SignInService {
  private readonly db;
  private readonly uuidToEmail = new Map<string, RequestSignInDTO>();
  private readonly emailToUUID = new Map<string, string>();

  constructor(databaseService: DatabaseService) {
    this.db = databaseService.db;
  }

  async requestSignIn(dto: RequestSignInDTO) {
    const [{ count }] = await this.db
      .select({ count: sql<number>`count(email)` })
      .from(users)
      .where(eq(users.email, dto.email));
    if (Number(count) === 0) throw new BadRequestException('You need to sign up first!');

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
