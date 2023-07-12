import { User } from '@my-task/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { MockAuthService, MockEmailService, mockAuthService, mockEmailService } from '~/mock';
import { EmailService } from '~/modules/email/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authService: MockAuthService;
  let emailService: MockEmailService;
  let controller: AuthController;

  beforeEach(async () => {
    [authService, emailService] = await Promise.all([mockAuthService(), mockEmailService()]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, AuthService],
      controllers: [AuthController],
    })
      .overrideProvider(EmailService)
      .useValue(emailService)
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

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
