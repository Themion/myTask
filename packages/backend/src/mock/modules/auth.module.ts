import { Test } from '@nestjs/testing';
import { CookieService } from '~/modules/auth/cookie.service';
import mockConfigModule from './config.module';
import mockJwtModule from './jwt.module';

const mockAuthModule = async () =>
  Test.createTestingModule({
    imports: [await mockConfigModule(), await mockJwtModule()],
    providers: [CookieService],
  }).compile();

export default mockAuthModule;
