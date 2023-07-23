import {
  MockEmailService,
  MockSignInService,
  mockEmailService,
  mockSignInModule,
  mockSignInService,
} from '~/mock';
import { SignInController } from './signin.controller';

describe('SignInController', () => {
  let signInService: MockSignInService;
  let emailService: MockEmailService;
  let controller: SignInController;

  beforeEach(async () => {
    [signInService, emailService] = await Promise.all([mockSignInService(), mockEmailService()]);
    const module = await mockSignInModule({ signInService, emailService });

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
});
