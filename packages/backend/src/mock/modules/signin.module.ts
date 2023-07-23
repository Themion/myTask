import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import mockConfigModule from '~/mock/modules/config.module';
import { MockEmailService, MockSignInService } from '~/mock/services';
import { SignInController } from '~/modules/auth/signin/signin.controller';
import { SignInService } from '~/modules/auth/signin/signin.service';
import { EmailService } from '~/modules/email/email.service';

type Props = {
  signInService?: MockSignInService;
  emailService?: MockEmailService;
};

const mockSignInModule = async ({ signInService, emailService }: Props) => {
  const providers: Provider[] = [SignInService];
  if (emailService) providers.push(EmailService);

  const useController = !!signInService;
  const controllers = useController ? [SignInController] : [];

  const moduleFactory = Test.createTestingModule({
    imports: [await mockConfigModule()],
    providers,
    controllers,
  });

  if (emailService) moduleFactory.overrideProvider(EmailService).useValue(emailService);
  if (signInService) moduleFactory.overrideProvider(SignInService).useValue(signInService);

  return moduleFactory.compile();
};

export default mockSignInModule;
