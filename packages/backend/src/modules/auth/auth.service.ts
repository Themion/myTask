import { ConfirmAuthDTO, RequestAuthDTO, dateAfter, users } from '@my-task/common';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_TABLE_NAME, SIGN_IN_LIFE_SPAN } from '~/constants';
import { CookieService } from '~/modules/auth/cookie.service';
import { CacheService } from '~/modules/cache/cache.service';
import { DatabaseService } from '~/modules/database/database.service';
import { GroupService } from '~/modules/group/group.service';

@Injectable()
export class AuthService {
  private readonly db;
  private readonly uuidToEmail;
  private readonly emailToUUID;
  private readonly RT2Email;

  constructor(
    private readonly cookieService: CookieService,
    private readonly groupService: GroupService,
    cacheService: CacheService,
    databaseService: DatabaseService,
  ) {
    this.db = databaseService.db;
    this.uuidToEmail = cacheService.toHash(CACHE_TABLE_NAME.uuidToEmail);
    this.emailToUUID = cacheService.toHash(CACHE_TABLE_NAME.emailToUUID);
    this.RT2Email = cacheService.toHash(CACHE_TABLE_NAME.RT2Email);
  }

  private async createUserIfNotExist(email: string) {
    const [{ countAsStr }] = await this.db
      .select({ countAsStr: sql<string>`count(email)` })
      .from(users)
      .where(eq(users.email, email));

    const count = parseInt(countAsStr);

    if (count === 0) {
      const insertedUsers = await this.db.insert(users).values({ email }).returning();
      if (insertedUsers.length !== 1)
        throw new InternalServerErrorException('DB insertion failed!');
      await this.groupService.createGroup(insertedUsers[0]);
    }

    return count === 0;
  }

  async request(dto: RequestAuthDTO) {
    const { email } = dto;

    const cachedUUID = await this.emailToUUID.get(email);
    if (cachedUUID) this.uuidToEmail.del(cachedUUID);

    const uuid = uuidv4();
    const signInExpiration = dateAfter(SIGN_IN_LIFE_SPAN);

    await Promise.all([
      this.uuidToEmail.set(uuid, email, signInExpiration),
      this.emailToUUID.set(email, uuid, signInExpiration),
    ]);

    return uuid;
  }

  async confirm(dto: ConfirmAuthDTO) {
    const { uuid } = dto;
    const email = await this.uuidToEmail.get(uuid);

    if (!email) throw new BadRequestException('UUID cannot be found: Wrong DTO!');

    await Promise.all([
      this.createUserIfNotExist(email),
      this.emailToUUID.del(email),
      this.uuidToEmail.del(uuid),
    ]);

    return { email };
  }

  async refresh(refreshToken: string) {
    const email = await this.RT2Email.get(refreshToken);
    if (!email) throw new UnauthorizedException('Cannot identify Refresh Token!');
    await this.RT2Email.del(refreshToken);
    return this.cookieService.setCookie(email);
  }

  removeRefreshToken(refreshToken: string) {
    return this.RT2Email.del(refreshToken);
  }
}
