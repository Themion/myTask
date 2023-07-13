import { CreateUserDTO, User } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockAuthModule, mockDatabaseModule } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    const databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockAuthModule({ databaseService });
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

  describe('requestJoinUser', () => {
    it('should work (validation will be in controller)', () => {
      const userToAdd: CreateUserDTO = { email: 'create@example.email' };
      const result = service.requestJoinUser(userToAdd);
      const parsedResult = z.string().uuid().safeParse(result);
      expect(parsedResult.success).toEqual(true);
    });

    describe('should throw error when', () => {
      it('pass same parameter', () => {
        const userToAdd: CreateUserDTO = { email: 'duplicate@example.email' };
        service.requestJoinUser(userToAdd);
        expect(() => service.requestJoinUser(userToAdd)).toThrow();
      });
    });
  });

  describe('confirmJoinUser (validation will be in controller)', () => {
    it('should work', async () => {
      const userToAdd: CreateUserDTO = { email: 'create@example.email' };
      const uuid = service.requestJoinUser(userToAdd);

      let createdUser: User = { id: -1, email: '' };
      expect((createdUser = await service.confirmJoinUser({ uuid }))).toBeDefined();
      expect(createdUser.email).toEqual(userToAdd.email);
    });

    describe('should throw error when', () => {
      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => service.confirmJoinUser({ uuid })).rejects.toThrow();
      });

      it('pass same parameter', async () => {
        const userToAdd: CreateUserDTO = { email: 'create@example.email' };
        const uuid = service.requestJoinUser(userToAdd);

        await service.confirmJoinUser({ uuid });
        await expect(async () => service.confirmJoinUser({ uuid })).rejects.toThrow();
      });
    });
  });
});
