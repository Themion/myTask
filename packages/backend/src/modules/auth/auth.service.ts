import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CookieService } from '~/modules/auth/cookie.service';
import { CacheService } from '~/modules/cache/cache.service';

@Injectable()
export class AuthService {
  private readonly RT2Email;

  constructor(private readonly cookieService: CookieService, cacheService: CacheService) {
    this.RT2Email = cacheService.toHash('RT2Email');
  }

  async refresh(refreshToken: string) {
    const email = await this.RT2Email.get(refreshToken);
    if (!email) throw new UnauthorizedException('Cannot identify Refresh Token!');
    await this.RT2Email.del(refreshToken);
    return this.cookieService.setCookie(email);
  }
}
