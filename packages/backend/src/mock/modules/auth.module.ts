import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockAuthService, MockEmailService } from '~/mock';
import { AuthController } from '~/modules/auth/auth.controller';
import { AuthService } from '~/modules/auth/auth.service';
import { DatabaseService } from '~/modules/database/database.service';
import { EmailService } from '~/modules/email/email.service';

type Props = {
  authService?: MockAuthService;
  databaseService?: DatabaseService;
  emailService?: MockEmailService;
};

const mockAuthModule = ({ authService, databaseService, emailService }: Props) => {
  const providers: Provider[] = [AuthService];
  const controllers = [AuthController];

  if (databaseService) providers.push(DatabaseService);
  if (emailService) providers.push(EmailService);

  // Controller의 Unit Test만 고려한 상태. integration test를 진행할 경우 값을 바꿔주어야 함
  const useController = !!authService && !!emailService;

  const moduleFactory = Test.createTestingModule({
    providers,
    controllers: useController ? controllers : [],
  });

  if (emailService) moduleFactory.overrideProvider(EmailService).useValue(emailService);
  if (authService) moduleFactory.overrideProvider(AuthService).useValue(authService);
  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);

  return moduleFactory.compile();
};

export default mockAuthModule;
