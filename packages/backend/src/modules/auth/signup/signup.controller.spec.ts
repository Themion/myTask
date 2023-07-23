import { User } from '@my-task/common';
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

  beforeEach(async () => {
    [signUpService, emailService, groupService] = await Promise.all([
      mockSignUpService(),
      mockEmailService(),
      mockGroupService(),
    ]);
    const module = await mockSignUpModule({ signUpService, emailService, groupService });

    controller = module.get<SignUpController>(SignUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestSignUp', () => {
    it('should work', () => {
      const userToAdd = { email: 'create@example.email' };
      expect(() => controller.requestSignUp(userToAdd)).not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', () => {
        const data = 'create@example.email';
        expect(() => controller.requestSignUp(data)).toThrow();
      });
    });
  });

  describe('confirmSignUp', () => {
    it('should work', async () => {
      const userToAdd = { email: 'create@example.email' };
      const { email } = controller.requestSignUp(userToAdd);

      const uuid = signUpService.emailToUuid.get(email);
      let user: User;
      expect((user = await controller.confirmSignUp({ uuid }))).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
      expect((await groupService.findGroupByMember(user)).length).toBeGreaterThan(0);
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        const wrongUUID = 'this is not uuid';
        await expect(async () => controller.confirmSignUp({ uuid: wrongUUID })).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => controller.confirmSignUp({ uuid })).rejects.toThrow();
      });
    });
  });
});
