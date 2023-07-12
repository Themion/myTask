import { User } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import {
  MockAuthService,
  MockEmailService,
  mockAuthModule,
  mockAuthService,
  mockEmailService,
} from '~/mock';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authService: MockAuthService;
  let emailService: MockEmailService;
  let controller: AuthController;

  beforeEach(async () => {
    [authService, emailService] = await Promise.all([mockAuthService(), mockEmailService()]);
    const module = await mockAuthModule({ authService, emailService });

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should work', () => {
      const userToAdd = { email: 'create@example.email' };
      expect(() => controller.createUser(userToAdd)).not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', () => {
        const data = 'create@example.email';
        expect(() => controller.createUser(data)).toThrow();
      });
    });
  });

  describe('createUserConfirm', () => {
    it('should work', async () => {
      const userToAdd = { email: 'create@example.email' };
      const { email } = controller.createUser(userToAdd);

      const uuid = authService.emailToUuid.get(email);
      let user: User;
      expect((user = await controller.createUserConfirm({ uuid }))).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        const wrongUUID = 'this is not uuid';
        await expect(async () =>
          controller.createUserConfirm({ uuid: wrongUUID }),
        ).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        const uuid = uuidv4();
        await expect(async () => controller.createUserConfirm({ uuid })).rejects.toThrow();
      });
    });
  });
});
