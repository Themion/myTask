import { RequestSignInDTO, RequestSignUpDTO } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDatabaseModule, mockSignInModule } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { SignInService } from './signin.service';

describe('SignInService', () => {
  let service: SignInService;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    const databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockSignInModule({ databaseService });

    service = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestSignIn', () => {
    it('should work (validation will be done in controller)', async () => {
      const userToAdd: RequestSignInDTO = { email: 'create@example.email' };

      const result = await service.requestSignIn(userToAdd);
      const parsedResult = z.string().uuid().safeParse(result);
      expect(parsedResult.success).toEqual(true);
    });
  });

  describe('confirmSignIn (validation will be in controller)', () => {
    it('should work', async () => {
      const userToAdd: RequestSignInDTO = { email: 'create@example.email' };
      const uuid = await service.requestSignIn(userToAdd);

      let createdUser: RequestSignUpDTO = { email: '' };
      expect((createdUser = await service.confirmSignIn({ uuid }))).toBeDefined();
      expect(createdUser.email).toEqual(userToAdd.email);
    });

    describe('should throw error when', () => {
      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => await service.confirmSignIn({ uuid })).rejects.toThrow();
      });
    });
  });
});
