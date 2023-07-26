import { RequestSignUpDTO, User } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDatabaseModule, mockSignUpModule } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { SignUpService } from './signup.service';

describe('SignUpService', () => {
  let service: SignUpService;
  let userToAdd: RequestSignUpDTO;
  let uuid: string;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    const databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockSignUpModule({ databaseService });
    service = module.get<SignUpService>(SignUpService);
  });

  beforeEach(() => {
    userToAdd = { email: 'create@example.email' };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestSignUp', () => {
    it('should work (validation will be in controller)', () => {
      const result = service.requestSignUp(userToAdd);
      const parsedResult = z.string().uuid().safeParse(result);
      expect(parsedResult.success).toEqual(true);
    });

    describe('should throw error when', () => {
      it('pass same parameter', () => {
        userToAdd = { email: 'duplicate@example.email' };
        service.requestSignUp(userToAdd);
        expect(() => service.requestSignUp(userToAdd)).toThrow();
      });
    });
  });

  describe('confirmSignUp (validation will be in controller)', () => {
    beforeEach(() => {
      uuid = service.requestSignUp(userToAdd);
    });

    it('should work', async () => {
      let createdUser: User = { id: -1, email: '' };
      expect((createdUser = await service.confirmSignUp({ uuid }))).toBeDefined();
      expect(createdUser.email).toEqual(userToAdd.email);
    });

    describe('should throw error when', () => {
      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => service.confirmSignUp({ uuid })).rejects.toThrow();
      });

      it('pass same parameter', async () => {
        await service.confirmSignUp({ uuid });
        await expect(async () => service.confirmSignUp({ uuid })).rejects.toThrow();
      });
    });
  });
});
