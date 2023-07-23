import { Test } from '@nestjs/testing';
import { CookieService } from '~/modules/auth/cookie.service';
import mockConfigModule from './config.module';

const mockAuthModule = async () =>
  Test.createTestingModule({
    imports: [await mockConfigModule()],
    providers: [CookieService],
  }).compile();

export default mockAuthModule;
