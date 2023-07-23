import { MockSignInService, mockSignInModule, mockSignInService } from '~/mock';
import { SignInController } from './signin.controller';

describe('SignInController', () => {
  let signInService: MockSignInService;
  let controller: SignInController;

  beforeEach(async () => {
    signInService = await mockSignInService();
    const module = await mockSignInModule({ signInService });

    controller = module.get<SignInController>(SignInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
