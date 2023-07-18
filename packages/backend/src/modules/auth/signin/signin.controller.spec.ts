import { RequestSignUpDTO } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import {
  MockCookieService,
  MockEmailService,
  MockResponse,
  MockSignInService,
  mockCookieService,
  mockDatabaseModule,
  mockEmailService,
  mockResponse,
  mockSignInModule,
  mockSignInService,
} from '~/mock';
import { DatabaseService } from '~/modules/database/database.service';
import { SignInController } from './signin.controller';

describe('SignInController', () => {
  let signInService: MockSignInService;
  let emailService: MockEmailService;
  let cookieService: MockCookieService;
  let controller: SignInController;

  beforeEach(async () => {
    const databaseModule = await mockDatabaseModule();
    const databaseService = databaseModule.get<DatabaseService>(DatabaseService);
    await databaseService.onModuleInit();

    [signInService, emailService, cookieService] = await Promise.all([
      mockSignInService(),
      mockEmailService(),
      mockCookieService(),
    ]);
    const module = await mockSignInModule({
      signInService,
      emailService,
      databaseService,
      cookieService,
    });

    controller = module.get<SignInController>(SignInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestSignIn', () => {
    it('should work', () => {
      const userToAdd = { email: 'create@example.email' };
      expect(controller.requestSignIn(userToAdd)).resolves.not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', async () => {
        const data = 'nonexist@example.email';
        await expect(controller.requestSignIn(data)).rejects.toThrow();
      });
    });
  });

  describe('confirmSignIn', () => {
    let response: MockResponse;

    beforeEach(() => {
      response = mockResponse();
    });

    it('should work', async () => {
      const userToAdd = { email: 'create@example.email' };
      const { email } = await controller.requestSignIn(userToAdd);

      const uuid = signInService.emailToUuid.get(email);
      let user: RequestSignUpDTO;
      expect((user = await controller.confirmSignIn({ uuid }, response))).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        const wrongUUID = 'this is not uuid';
        await expect(async () =>
          controller.confirmSignIn({ uuid: wrongUUID }, response),
        ).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => controller.confirmSignIn({ uuid }, response)).rejects.toThrow();
      });
    });
  });
});
