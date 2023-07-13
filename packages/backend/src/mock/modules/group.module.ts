import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DatabaseService } from '~/modules/database/database.service';
import { GroupService } from '~/modules/group/group.service';

type Props = {
  databaseService?: DatabaseService;
};

const mockGroupModule = ({ databaseService }: Props) => {
  const providers: Provider[] = [GroupService];

  if (databaseService) providers.push(DatabaseService);

  const moduleFactory = Test.createTestingModule({
    providers,
  });
  if (databaseService) moduleFactory.overrideProvider(DatabaseService).useValue(databaseService);

  return moduleFactory.compile();
};

export default mockGroupModule;
