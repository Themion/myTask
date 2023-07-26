import { User, users } from '@my-task/common';
import { DatabaseError } from 'pg';
import { mockDatabaseModule, mockGroupModule } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { GroupService } from './group.service';

describe('GroupService', () => {
  let service: GroupService;
  let databaseService: DatabaseService;
  let creator: User;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockGroupModule({ databaseService });
    service = module.get<GroupService>(GroupService);

    creator = (
      await databaseService.db.insert(users).values({ email: 'test@example.com' }).returning()
    )[0];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createGroup', () => {
    it('should work', async () => {
      const name = 'Test123';

      const createdGroups = await service.createGroup(creator, name);
      expect(createdGroups).toBeDefined();
      expect(createdGroups.name).toEqual(name);
    });

    describe('should throw error when', () => {
      it('cannot find creator from DB', async () => {
        creator.id = -1;
        await expect(
          async () => await service.createGroup(creator, 'invalid test'),
        ).rejects.toThrowError(DatabaseError);
      });
    });
  });

  describe('findGroupByMember', () => {
    it('should work', async () => {
      await expect(service.findGroupByMember(creator)).resolves.not.toThrow();
    });
  });
});
