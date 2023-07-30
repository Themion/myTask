import { v4 as uuidv4 } from 'uuid';
import {
  MockEmailService,
  MockGroupService,
  MockSignUpService,
  mockEmailService,
  mockGroupService,
  mockSignUpModule,
  mockSignUpService,
} from '~/mock';
import { SignUpController } from './signup.controller';

describe('SignUpController', () => {
  let signUpService: MockSignUpService;
  let emailService: MockEmailService;
  let groupService: MockGroupService;
  let controller: SignUpController;

  let userToAdd: any;

  beforeEach(async () => {
    [signUpService, emailService, groupService] = await Promise.all([
      mockSignUpService(),
      mockEmailService(),
      mockGroupService(),
    ]);
    const module = await mockSignUpModule({ signUpService, emailService, groupService });

    controller = module.get<SignUpController>(SignUpController);
  });
  beforeEach(async () => {
    userToAdd = { email: 'create@example.email' };
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestSignUp', () => {
    it('should work', async () => {
      const userToAdd = { email: 'create@example.email' };
      await expect(controller.requestSignUp(userToAdd)).resolves.not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', async () => {
        const data = 'create@example.email';
        await expect(controller.requestSignUp(data)).rejects.toThrow();
      });
    });
  });

  describe('confirmSignUp', () => {
    let email: string;
    let uuid: string;

    beforeEach(async () => {
      email = (await controller.requestSignUp(userToAdd)).email;
    });

    it('should work', async () => {
      uuid = signUpService.emailToUuid.get(email) as string;

      const user = await controller.confirmSignUp({ uuid });
      expect(user).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
      expect((await groupService.findGroupByMember(user)).length).toBeGreaterThan(0);
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        uuid = 'this is not uuid';
        await expect(async () => controller.confirmSignUp({ uuid })).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        uuid = uuidv4();
        await expect(async () => controller.confirmSignUp({ uuid })).rejects.toThrow();
      });
    });
  });
});
