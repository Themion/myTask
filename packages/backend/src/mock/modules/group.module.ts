import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockGroupService, MockMemberService } from '~/mock/services';
import { DatabaseService } from '~/modules/database/database.service';
import { GroupController } from '~/modules/group/group.controller';
import { GroupService } from '~/modules/group/group.service';
import { MemberService } from '~/modules/member/member.service';

type Props = {
  databaseService?: DatabaseService;
  groupService?: MockGroupService;
  memberService?: MockMemberService;
};

const mockGroupModule = ({ databaseService, groupService, memberService }: Props) => {
  const useController = !!groupService;
  const controllers = useController ? [GroupController] : [];

  const providers: Provider[] = [GroupService];

  if (databaseService) providers.push(DatabaseService);
  if (memberService || !groupService) providers.push(MemberService);

  const moduleFactory = Test.createTestingModule({
    providers,
    controllers,
  });

  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);
  if (groupService) moduleFactory.overrideProvider(GroupService).useValue(groupService);
  if (memberService) moduleFactory.overrideProvider(MemberService).useValue(memberService);

  return moduleFactory.compile();
};

export default mockGroupModule;
