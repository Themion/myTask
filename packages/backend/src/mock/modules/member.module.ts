import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '~/modules/database/database.service';
import { MemberService } from '~/modules/member/member.service';

type Props = {
  databaseService?: DatabaseService;
};

const mockMemberModule = ({ databaseService }: Props) => {
  const providers: Provider[] = [MemberService];

  if (databaseService) providers.push(DatabaseService);

  const moduleFactory = Test.createTestingModule({
    providers,
  });

  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);

  return moduleFactory.compile();
};

export default mockMemberModule;
