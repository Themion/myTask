import { users } from '@my-task/common';
import { mockDatabaseModule } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module = await mockDatabaseModule();
    service = module.get<DatabaseService>(DatabaseService);
    await service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should work', async () => {
    expect(service.db).toBeDefined();
    await expect(service.db.select({ id: users.id }).from(users).limit(10)).resolves.not.toThrow();
  });
});
