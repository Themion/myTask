import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockEmailService, MockGroupService, MockSignupService } from '~/mock/services';
import { SignupController } from '~/modules/auth/signup/signup.controller';
import { SignupService } from '~/modules/auth/signup/signup.service';
import { DatabaseService } from '~/modules/database/database.service';
import { EmailService } from '~/modules/email/email.service';
import { GroupService } from '~/modules/group/group.service';

type Props = {
  signupService?: MockSignupService;
  databaseService?: DatabaseService;
  emailService?: MockEmailService;
  groupService?: MockGroupService;
};

const mockSignupModule = ({
  signupService,
  databaseService,
  emailService,
  groupService,
}: Props) => {
  const providers: Provider[] = [SignupService];
  const controllers = [SignupController];

  if (databaseService) providers.push(DatabaseService);
  if (emailService) providers.push(EmailService);
  if (groupService) providers.push(GroupService);

  // Controller의 Unit Test만 고려한 상태. integration test를 진행할 경우 값을 바꿔주어야 함
  const useController = !!signupService && !!emailService;

  const moduleFactory = Test.createTestingModule({
    providers,
    controllers: useController ? controllers : [],
  });

  if (emailService) moduleFactory.overrideProvider(EmailService).useValue(emailService);
  if (signupService) moduleFactory.overrideProvider(SignupService).useValue(signupService);
  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);
  if (groupService) moduleFactory.overrideProvider(GroupService).useValue(groupService);

  return moduleFactory.compile();
};

export default mockSignupModule;
