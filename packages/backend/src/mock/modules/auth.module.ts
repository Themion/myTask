import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  MockAuthService,
  MockCacheService,
  MockCookieService,
  MockEmailService,
  MockGroupService,
} from '~/mock/services';
import { AuthController } from '~/modules/auth/auth.controller';
import { AuthService } from '~/modules/auth/auth.service';
import { CookieService } from '~/modules/auth/cookie.service';
import { JwtStrategy } from '~/modules/auth/strategy';
import { CacheService } from '~/modules/cache/cache.service';
import { DatabaseService } from '~/modules/database/database.service';
import { EmailService } from '~/modules/email/email.service';
import { GroupService } from '~/modules/group/group.service';
import mockConfigModule from './config.module';
import mockJwtModule from './jwt.module';

type Props = {
  authService?: MockAuthService;
  cacheService?: MockCacheService;
  cookieService?: MockCookieService;
  databaseService?: DatabaseService;
  emailService?: MockEmailService;
  groupService?: MockGroupService;
};

const mockAuthModule = async ({
  authService,
  cacheService,
  cookieService,
  databaseService,
  emailService,
  groupService,
}: Props) => {
  const providers: Provider[] = [CacheService, CookieService, JwtStrategy];

  if (authService || databaseService) providers.push(AuthService);
  if (cookieService) providers.push(CookieService);
  if (databaseService) providers.push(DatabaseService);
  if (emailService) providers.push(EmailService);
  if (groupService) providers.push(GroupService);

  const useController = !!authService && !!cookieService;
  const controllers = useController ? [AuthController] : [];

  const moduleFactory = Test.createTestingModule({
    imports: [await mockConfigModule(), await mockJwtModule()],
    providers,
    controllers,
  });

  if (authService) moduleFactory.overrideProvider(AuthService).useValue(authService);
  if (cacheService) moduleFactory.overrideProvider(CacheService).useValue(cacheService);
  if (cookieService) moduleFactory.overrideProvider(CookieService).useValue(cookieService);
  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);
  if (emailService) moduleFactory.overrideProvider(EmailService).useValue(emailService);
  if (groupService) moduleFactory.overrideProvider(GroupService).useValue(groupService);

  return moduleFactory.compile();
};

export default mockAuthModule;
