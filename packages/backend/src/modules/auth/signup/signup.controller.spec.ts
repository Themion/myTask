import { User } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import {
  MockEmailService,
  MockGroupService,
  MockSignupService,
  mockEmailService,
  mockGroupService,
  mockSignupModule,
  mockSignupService,
} from '~/mock';
import { SignupController } from './signup.controller';

describe('SignupController', () => {
  let signupService: MockSignupService;
  let emailService: MockEmailService;
  let groupService: MockGroupService;
  let controller: SignupController;

  beforeEach(async () => {
    [signupService, emailService, groupService] = await Promise.all([
      mockSignupService(),
      mockEmailService(),
      mockGroupService(),
    ]);
    const module = await mockSignupModule({ signupService, emailService, groupService });

    controller = module.get<SignupController>(SignupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestJoinUser', () => {
    it('should work', () => {
      const userToAdd = { email: 'create@example.email' };
      expect(() => controller.requestJoinUser(userToAdd)).not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', () => {
        const data = 'create@example.email';
        expect(() => controller.requestJoinUser(data)).toThrow();
      });
    });
  });

  describe('confirmJoinUser', () => {
    it('should work', async () => {
      const userToAdd = { email: 'create@example.email' };
      const { email } = controller.requestJoinUser(userToAdd);

      const uuid = signupService.emailToUuid.get(email);
      let user: User;
      expect((user = await controller.confirmJoinUser({ uuid }))).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
      expect((await groupService.findGroupByMember(user)).length).toBeGreaterThan(0);
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        const wrongUUID = 'this is not uuid';
        await expect(async () => controller.confirmJoinUser({ uuid: wrongUUID })).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => controller.confirmJoinUser({ uuid })).rejects.toThrow();
      });
    });
  });
});
