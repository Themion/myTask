import { RequestSignUpDTO } from '@my-task/common';
import { v4 as uuidv4 } from 'uuid';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants';
import {
  MockCookieService,
  MockEmailService,
  MockResponse,
  MockSignInService,
  mockCookieService,
  mockEmailService,
  mockResponse,
  mockSignInModule,
  mockSignInService,
} from '~/mock';
import { SignInController } from './signin.controller';

describe('SignInController', () => {
  let signInService: MockSignInService;
  let emailService: MockEmailService;
  let cookieService: MockCookieService;
  let controller: SignInController;

  beforeEach(async () => {
    [signInService, emailService, cookieService] = await Promise.all([
      mockSignInService(),
      mockEmailService(),
      mockCookieService(),
    ]);
    const module = await mockSignInModule({
      signInService,
      emailService,
      cookieService,
    });

    controller = module.get<SignInController>(SignInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('requestSignIn', () => {
    it('should work', () => {
      const userToAdd = { email: 'create@example.email' };
      expect(controller.requestSignIn(userToAdd)).resolves.not.toThrow();
    });

    describe('should throw error with', () => {
      it('non-object', async () => {
        const data = 'nonexist@example.email';
        await expect(controller.requestSignIn(data)).rejects.toThrow();
      });
    });
  });

  describe('confirmSignIn', () => {
    let response: MockResponse;
    let userToAdd: RequestSignUpDTO;
    let uuid: string;
    let user: RequestSignUpDTO;

    beforeEach(() => {
      response = mockResponse();
      userToAdd = { email: 'create@example.email' };
    });

    it('should work', async () => {
      const { email } = await controller.requestSignIn(userToAdd);

      uuid = signInService.emailToUuid.get(email) as string;
      expect((user = await controller.confirmSignIn({ uuid }, response))).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);

      expect(response.cookies[ACCESS_TOKEN]).toBeDefined();
      expect(response.cookies[REFRESH_TOKEN]).toBeDefined();
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        uuid = 'this is not uuid';
        await expect(async () => controller.confirmSignIn({ uuid }, response)).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        uuid = uuidv4();
        await expect(async () => controller.confirmSignIn({ uuid }, response)).rejects.toThrow();
      });
    });
  });
});
