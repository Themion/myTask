import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import mockConfigModule from '~/mock/modules/config.module';
import { MockEmailService, MockGroupService, MockSignUpService } from '~/mock/services';
import { SignUpController } from '~/modules/auth/signup/signup.controller';
import { SignUpService } from '~/modules/auth/signup/signup.service';
import { CacheService } from '~/modules/cache/cache.service';
import { DatabaseService } from '~/modules/database/database.service';
import { EmailService } from '~/modules/email/email.service';
import { GroupService } from '~/modules/group/group.service';

type Props = {
  signUpService?: MockSignUpService;
  databaseService?: DatabaseService;
  emailService?: MockEmailService;
  groupService?: MockGroupService;
};

const mockSignUpModule = async ({
  signUpService,
  databaseService,
  emailService,
  groupService,
}: Props) => {
  const providers: Provider[] = [SignUpService, CacheService];
  const controllers = [SignUpController];

  if (databaseService) providers.push(DatabaseService);
  if (emailService) providers.push(EmailService);
  if (groupService) providers.push(GroupService);

  // Controller의 Unit Test만 고려한 상태. integration test를 진행할 경우 값을 바꿔주어야 함
  const useController = !!signUpService && !!emailService;

  const moduleFactory = Test.createTestingModule({
    imports: [await mockConfigModule()],
    providers,
    controllers: useController ? controllers : [],
  });

  if (signUpService) moduleFactory.overrideProvider(SignUpService).useValue(signUpService);
  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);
  if (emailService) moduleFactory.overrideProvider(EmailService).useValue(emailService);
  if (groupService) moduleFactory.overrideProvider(GroupService).useValue(groupService);

  return moduleFactory.compile();
};

export default mockSignUpModule;
