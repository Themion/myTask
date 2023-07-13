import { mockDatabaseModule, mockGroupModule } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let service: GroupService;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    const databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockGroupModule({ databaseService });
    service = module.get<GroupService>(GroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGroup', () => {
    it('should work', async () => {
      const name = 'Test123';
      const createdGroups = await service.createGroup(name);
      expect(createdGroups).toBeDefined();
      expect(createdGroups.name).toEqual(name);
    });
  });
});
