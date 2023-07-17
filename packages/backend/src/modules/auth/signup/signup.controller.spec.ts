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
  let signupService: MockSignUpService;
  let emailService: MockEmailService;
  let groupService: MockGroupService;
  let controller: SignUpController;

  beforeEach(async () => {
    [signupService, emailService, groupService] = await Promise.all([
      mockSignUpService(),
      mockEmailService(),
      mockGroupService(),
    ]);
    const module = await mockSignUpModule({ signupService, emailService, groupService });

    controller = module.get<SignUpController>(SignUpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestSignUpUser', () => {
    it('should work', () => {
      const userToAdd = { email: 'create@example.email' };
      expect(() => controller.requestSignUpUser(userToAdd)).not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', () => {
        const data = 'create@example.email';
        expect(() => controller.requestSignUpUser(data)).toThrow();
      });
    });
  });

  describe('confirmSignUpUser', () => {
    it('should work', async () => {
      const userToAdd = { email: 'create@example.email' };
      const { email } = controller.requestSignUpUser(userToAdd);

      const uuid = signupService.emailToUuid.get(email);
      let user: User;
      expect((user = await controller.confirmSignUpUser({ uuid }))).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
      expect((await groupService.findGroupByMember(user)).length).toBeGreaterThan(0);
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        const wrongUUID = 'this is not uuid';
        await expect(async () =>
          controller.confirmSignUpUser({ uuid: wrongUUID }),
        ).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => controller.confirmSignUpUser({ uuid })).rejects.toThrow();
      });
    });
  });
});
