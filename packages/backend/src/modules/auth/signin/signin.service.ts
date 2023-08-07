import { ConfirmSignInDTO, RequestSignInDTO, dateAfter, users } from '@my-task/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_TABLE_NAME, SIGN_IN_LIFE_SPAN } from '~/constants';
import { CacheService } from '~/modules/cache/cache.service';
import { DatabaseService } from '~/modules/database/database.service';

@Injectable()
export class SignInService {
  private readonly db;
  private readonly uuidToEmail;

  constructor(cacheService: CacheService, databaseService: DatabaseService) {
    this.db = databaseService.db;
    this.uuidToEmail = cacheService.toHash(CACHE_TABLE_NAME.signInTable);
  }

  async requestSignIn(dto: RequestSignInDTO) {
    const { email } = dto;

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(email)` })
      .from(users)
      .where(eq(users.email, dto.email));
    if (Number(count) === 0) throw new BadRequestException('You need to sign up first!');

    const uuid = uuidv4();
    const signInExpiration = dateAfter(SIGN_IN_LIFE_SPAN);

    await this.uuidToEmail.set(uuid, email, signInExpiration);

    return uuid;
  }

  async confirmSignIn(dto: ConfirmSignInDTO) {
    const { uuid } = dto;
    const email = await this.uuidToEmail.get(uuid);

    if (!email) throw new BadRequestException('UUID cannot be found: Wrong DTO!');

    await this.uuidToEmail.del(uuid);

    return { email };
  }
}
