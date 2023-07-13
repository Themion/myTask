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

      const uuid = authService.emailToUuid.get(email);
      let user: User;
      expect((user = await controller.confirmJoinUser({ uuid }))).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
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
