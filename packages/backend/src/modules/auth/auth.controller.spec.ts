import { RequestAuthDTO } from '@my-task/common';
import { ResponseCookie } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants';
import {
  MockAuthService,
  MockCookieService,
  MockEmailService,
  MockGroupService,
  MockRequest,
  MockResponse,
  mockAuthModule,
  mockAuthService,
  mockCookieService,
  mockEmailService,
  mockGroupService,
  mockRequest,
  mockResponse,
  validEmail,
} from '~/mock';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authService: MockAuthService;
  let cookieService: MockCookieService;
  let emailService: MockEmailService;
  let groupService: MockGroupService;
  let controller: AuthController;

  let email: string;
  let userToAdd: RequestAuthDTO;
  let refreshToken: string;
  let request: MockRequest;
  let response: MockResponse;

  beforeEach(async () => {
    [authService, cookieService, emailService, groupService] = await Promise.all([
      mockAuthService(),
      mockCookieService(),
      mockEmailService(),
      mockGroupService(),
    ]);

    const module = await mockAuthModule({ authService, cookieService, emailService, groupService });

    controller = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    email = validEmail;
    userToAdd = { email };
    refreshToken = uuidv4();

    request = mockRequest();
    response = mockResponse();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('request', () => {
    it('should work', async () => {
      await expect(controller.request(userToAdd)).resolves.not.toThrow();
    });
  });

  describe('confirm', () => {
    let uuid: string;

    beforeEach(async () => {
      email = (await controller.request(userToAdd)).email;
    });

    it('should work', async () => {
      uuid = authService.emailToUuid.get(email) as string;

      const user = await controller.confirm({ uuid }, response);
      expect(user).toBeDefined();
      expect(user.email).toEqual(userToAdd.email);
    });

    describe('should throw error with', () => {
      it('wrong dto', async () => {
        uuid = 'this is not uuid';
        await expect(async () => controller.confirm({ uuid }, response)).rejects.toThrow();
      });

      it('non-existing uuid', async () => {
        uuid = uuidv4();
        await expect(async () => controller.confirm({ uuid }, response)).rejects.toThrow();
      });
    });
  });

  describe('refresh', () => {
    it('should work', async () => {
      request.cookies[REFRESH_TOKEN] = refreshToken;
      const result = await controller.refresh(request, response);

      expect(result.refreshed).toEqual(true);
      expect(response.cookies[ACCESS_TOKEN]).toBeDefined();
      expect(response.cookies[REFRESH_TOKEN]).toBeDefined();
      expect(response.cookies[REFRESH_TOKEN]).not.toEqual(refreshToken);
    });

    // cache 관련 로직은 AuthService에서 처리한다고 가정
    describe('should throw error when', () => {
      it('without refresh token', async () => {
        await expect(controller.refresh(request, response)).rejects.toThrow();
      });
    });
  });

  describe('signOut', () => {
    describe('should work', () => {
      beforeEach(async () => {
        request.cookies[ACCESS_TOKEN] = 'sample access token';
        request.cookies[REFRESH_TOKEN] = refreshToken;

        await controller.signOut(request, response);
      });

      it('access token', () => {
        const { value, options } = response.cookies[ACCESS_TOKEN] as ResponseCookie;
        const { expires } = options;

        expect(value).toEqual('');
        expect(new Date(expires).getTime()).toBeLessThan(new Date().getTime());
      });

      it('access token', () => {
        const { value, options } = response.cookies[REFRESH_TOKEN] as ResponseCookie;
        const { expires } = options;

        expect(value).toEqual('');
        expect(new Date(expires).getTime()).toBeLessThan(new Date().getTime());
      });
    });
  });
});
