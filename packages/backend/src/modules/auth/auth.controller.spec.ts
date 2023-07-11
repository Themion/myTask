import { CreateUserConfirmDTO, CreateUserDTO, User } from '@my-task/common';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '~/modules/email/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let mockAuthService: any;
  let mockEmailService: any;
  let controller: AuthController;

  beforeEach(async () => {
    mockAuthService = {
      uuidToEmail: new Map<string, CreateUserDTO>(),
      emailToUuid: new Map<string, string>(),
      createUser(dto: CreateUserDTO) {
        const uuid = uuidv4();
        this.uuidToEmail.set(uuid, dto);
        this.emailToUuid.set(dto.email, uuid);
        return uuid;
      },
      createUserConfirm(dto: CreateUserConfirmDTO) {
        if (!this.uuidToEmail.has(dto.uuid))
          throw new BadRequestException('UUID cannot be found: Wrong DTO!');
        const data = this.uuidToEmail.get(dto.uuid) as CreateUserDTO;

        const user: User = { id: Math.floor(Math.random() * 10), ...data };
        return user;
      },
    };

    mockEmailService = {
      sendJoinEmail: (target: string, uuid: string) =>
        new Promise((resolve) => resolve({ target, uuid })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, AuthService],
      controllers: [AuthController],
    })
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
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

      const uuid = mockAuthService?.emailToUuid?.get(email);
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
