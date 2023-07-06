import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseProvider } from '~/modules/database/database.provider';
import { DatabaseService } from '~/modules/database/database.service';
import { users } from '~/modules/database/schema';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(() => process.env)],
      providers: [DatabaseService, DatabaseProvider],
    }).compile();

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
