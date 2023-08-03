import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import mockConfigModule from '~/mock/modules/config.module';
import { MockCookieService, MockEmailService, MockSignInService } from '~/mock/services';
import { CookieService } from '~/modules/auth/cookie.service';
import { SignInController } from '~/modules/auth/signin/signin.controller';
import { SignInService } from '~/modules/auth/signin/signin.service';
import { CacheService } from '~/modules/cache/cache.service';
import { DatabaseService } from '~/modules/database/database.service';
import { EmailService } from '~/modules/email/email.service';

type Props = {
  signInService?: MockSignInService;
  cookieService?: MockCookieService;
  databaseService?: DatabaseService;
  emailService?: MockEmailService;
};

const mockSignInModule = async ({
  signInService,
  databaseService,
  cookieService,
  emailService,
}: Props) => {
  const providers: Provider[] = [SignInService, CacheService];

  if (databaseService) providers.push(DatabaseService);
  if (cookieService) providers.push(CookieService);
  if (emailService) providers.push(EmailService);

  const useController = !!signInService;
  const controllers = useController ? [SignInController] : [];

  const moduleFactory = Test.createTestingModule({
    imports: [await mockConfigModule()],
    providers,
    controllers,
  });

  if (cookieService) moduleFactory.overrideProvider(CookieService).useValue(cookieService);
  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);
  if (emailService) moduleFactory.overrideProvider(EmailService).useValue(emailService);
  if (signInService) moduleFactory.overrideProvider(SignInService).useValue(signInService);

  return moduleFactory.compile();
};

export default mockSignInModule;
