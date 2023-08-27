import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockEmailService, MockMemberService } from '~/mock/services';
import { DatabaseService } from '~/modules/database/database.service';
import { EmailService } from '~/modules/email/email.service';
import { MemberController } from '~/modules/member/member.controller';
import { MemberService } from '~/modules/member/member.service';

type Props = {
  memberService?: MockMemberService;
  databaseService?: DatabaseService;
  emailService?: MockEmailService;
};

const mockMemberModule = ({ memberService, databaseService, emailService }: Props) => {
  const providers: Provider[] = [MemberService];

  const useController = !!emailService;
  const controllers = useController ? [MemberController] : [];

  if (memberService) providers.push(MemberService);
  if (databaseService) providers.push(DatabaseService);
  if (emailService) providers.push(EmailService);

  const moduleFactory = Test.createTestingModule({
    providers,
    controllers,
  });

  if (memberService) moduleFactory.overrideProvider(MemberService).useValue(memberService);
  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);
  if (emailService) moduleFactory.overrideProvider(EmailService).useValue(emailService);

  return moduleFactory.compile();
};

export default mockMemberModule;
