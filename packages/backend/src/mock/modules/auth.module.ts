import { Test } from '@nestjs/testing';
import { AuthService } from '~/modules/auth/auth.service';
import { CookieService } from '~/modules/auth/cookie.service';
import { CacheService } from '~/modules/cache/cache.service';
import mockConfigModule from './config.module';
import mockJwtModule from './jwt.module';

const mockAuthModule = async ({}) =>
  Test.createTestingModule({
    imports: [await mockConfigModule(), await mockJwtModule()],
    providers: [AuthService, CookieService, CacheService],
  }).compile();

export default mockAuthModule;
