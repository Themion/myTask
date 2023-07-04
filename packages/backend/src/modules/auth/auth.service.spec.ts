import { CreateUserDTO } from '@my-task/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '~/modules/auth/auth.service';
import { DatabaseProvider } from '~/modules/database/database.provider';
import { DatabaseService } from '~/modules/database/database.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const databaseModule: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(() => process.env)],
      providers: [DatabaseService, DatabaseProvider],
    }).compile();

    const databaseService = databaseModule.get<DatabaseService>(DatabaseService);

    await databaseService.onModuleInit();

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

  describe('readAll', () => {
    it('should work', async () => {
      await expect(service.readAll()).resolves.not.toThrow();
    });
  });

  describe('createUser', () => {
    it('should work (validation will be in controller)', async () => {
      const userToAdd: CreateUserDTO = { email: 'create@example.email' };
      const createdUser = await service.createUser(userToAdd);
      expect(createdUser.email).toEqual(userToAdd.email);
    });
  });
});
