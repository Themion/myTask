import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseProvider } from '~/modules/database/database.provider';
import { DatabaseService } from '~/modules/database/database.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const databaseModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(() => process.env)],
      providers: [DatabaseService, DatabaseProvider],
    }).compile();

    const databaseService = databaseModule.get<DatabaseService>(DatabaseService);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService, AuthService],
    })
      .overrideProvider(DatabaseService)
      .useValue(databaseService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
