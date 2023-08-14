import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockGroupService } from '~/mock/services';
import { DatabaseService } from '~/modules/database/database.service';
import { GroupController } from '~/modules/group/group.controller';
import { GroupService } from '~/modules/group/group.service';

type Props = {
  databaseService?: DatabaseService;
  groupService?: MockGroupService;
};

const mockGroupModule = ({ databaseService, groupService }: Props) => {
  const useController = !!groupService;
  const controllers = useController ? [GroupController] : [];

  const providers: Provider[] = [GroupService];

  if (databaseService) providers.push(DatabaseService);
  if (groupService) providers.push(GroupService);

  const moduleFactory = Test.createTestingModule({
    providers,
    controllers,
  });

  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);
  if (groupService) moduleFactory.overrideProvider(GroupService).useValue(groupService);

  return moduleFactory.compile();
};

export default mockGroupModule;
