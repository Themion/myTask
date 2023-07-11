import { CreateUserDTO, User } from '@my-task/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
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
    it('should work (validation will be in controller)', () => {
      const userToAdd: CreateUserDTO = { email: 'create@example.email' };
      const result = service.createUser(userToAdd);
      const parsedResult = z.string().uuid().safeParse(result);
      expect(parsedResult.success).toEqual(true);
    });

    describe('should throw error when', () => {
      it('pass same parameter', () => {
        const userToAdd: CreateUserDTO = { email: 'duplicate@example.email' };
        service.createUser(userToAdd);
        expect(() => service.createUser(userToAdd)).toThrow();
      });
    });
  });

  describe('createUserConfirm (validation will be in controller)', () => {
    it('should work', async () => {
      const userToAdd: CreateUserDTO = { email: 'create@example.email' };
      const uuid = service.createUser(userToAdd);

      let createdUser: User = { id: -1, email: '' };
      expect((createdUser = await service.createUserConfirm({ uuid }))).toBeDefined();
      expect(createdUser.email).toEqual(userToAdd.email);
    });

    describe('should throw error when', () => {
      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => service.createUserConfirm({ uuid })).rejects.toThrow();
      });

      it('pass same parameter', async () => {
        const userToAdd: CreateUserDTO = { email: 'create@example.email' };
        const uuid = service.createUser(userToAdd);

        await service.createUserConfirm({ uuid });
        await expect(async () => service.createUserConfirm({ uuid })).rejects.toThrow();
      });
    });
  });
});
