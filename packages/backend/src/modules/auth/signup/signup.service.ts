import { ConfirmSignUpDTO, RequestSignUpDTO, dateAfter, users } from '@my-task/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_TABLE_NAME, SIGN_UP_LIFE_SPAN } from '~/constants';
import { CacheService } from '~/modules/cache/cache.service';
import { DatabaseService } from '~/modules/database/database.service';

@Injectable()
export class SignUpService {
  private readonly db;
  private readonly pendingEmail;
  private readonly uuidToEmail;

  constructor(cacheService: CacheService, databaseService: DatabaseService) {
    this.db = databaseService.db;
    this.pendingEmail = cacheService.toSet(CACHE_TABLE_NAME.pendingEmail);
    this.uuidToEmail = cacheService.toHash(CACHE_TABLE_NAME.signUpTable);
  }

  async requestSignUp(dto: RequestSignUpDTO) {
    const { email } = dto;

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(email)` })
      .from(users)
      .where(eq(users.email, dto.email));
    if (Number(count) !== 0) throw new BadRequestException('Email is already used!');

    if (await this.pendingEmail.has(email)) throw new BadRequestException('Emali already exists!');

    const uuid = uuidv4();
    const signUpExpiration = dateAfter(SIGN_UP_LIFE_SPAN);

    await Promise.all([
      this.pendingEmail.set(email, signUpExpiration),
      this.uuidToEmail.set(uuid, email, signUpExpiration),
    ]);

    return uuid;
  }

  async confirmSignUp(dto: ConfirmSignUpDTO) {
    const { uuid } = dto;

    const email = await this.uuidToEmail.get(uuid);
    if (!email) throw new BadRequestException('UUID cannot be found: Wrong DTO!');

    await Promise.all([this.uuidToEmail.del(uuid), this.pendingEmail.del(email)]);

    const insertedUsers = await this.db.insert(users).values({ email }).returning();
    if (insertedUsers.length !== 1) throw new InternalServerErrorException('DB insertion failed!');
    else return insertedUsers[0];
  }
}
