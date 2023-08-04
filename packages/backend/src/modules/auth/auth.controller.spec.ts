import { v4 as uuidv4 } from 'uuid';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants';
import {
  MockRequest,
  MockResponse,
  mockAuthModule,
  mockAuthService,
  mockRequest,
  mockResponse,
} from '~/mock';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const authService = await mockAuthService();
    const module = await mockAuthModule({ authService });
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('refresh', () => {
    let response: MockResponse;
    let request: MockRequest;
    let refreshToken: string;

    beforeEach(() => {
      refreshToken = uuidv4();

      request = mockRequest();
      response = mockResponse();
    });

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
});
