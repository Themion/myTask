import { RequestSignInDTO, RequestSignUpDTO, users } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { mockDatabaseModule, mockSignInModule } from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { SignInService } from './signin.service';

describe('SignInService', () => {
  let service: SignInService;
  let userToAdd: RequestSignInDTO;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    const module = await mockSignInModule({ databaseService });

    service = module.get<SignInService>(SignInService);
  });

  beforeEach(async () => {
    userToAdd = { email: 'create@example.email' };

    await databaseService.db
      .insert(users)
      .values({ email: userToAdd.email })
      .onConflictDoNothing()
      .returning();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('requestSignIn', () => {
    it('should work (validation will be done in controller)', async () => {
      const result = await service.requestSignIn(userToAdd);
      const parsedResult = z.string().uuid().safeParse(result);
      expect(parsedResult.success).toEqual(true);
    });

    it('should throw error when', async () => {
      userToAdd.email = 'invalid@email.com';
      await expect(async () => service.requestSignIn(userToAdd)).rejects.toThrow();
    });
  });

  describe('confirmSignIn (validation will be in controller)', () => {
    let uuid: string;

    it('should work', async () => {
      uuid = await service.requestSignIn(userToAdd);

      let createdUser: RequestSignUpDTO = { email: '' };
      expect((createdUser = await service.confirmSignIn({ uuid }))).toBeDefined();
      expect(createdUser.email).toEqual(userToAdd.email);
    });

    describe('should throw error when', () => {
      it('non-existing uuid', async () => {
        uuid = uuidv4();
        await expect(async () => await service.confirmSignIn({ uuid })).rejects.toThrow();
      });
    });
  });
});
