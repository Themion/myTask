import { createUserDTO } from '@my-task/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '~/modules/auth/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockAuthService = {
      createUser: (data: any) => createUserDTO.parseAsync(data),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should work', async () => {
      const userToAdd = { email: 'create@example.email' };
      await expect(controller.createUser(userToAdd)).resolves.not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', async () => {
        const data = 'create@example.email';
        expect(() => controller.createUser(data)).toThrow();
      });
    });
  });
});
