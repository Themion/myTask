import { mockCookieService } from '~/mock/services/cookie.service';

const mockAuthService = async () => ({
  cookieService: mockCookieService(),

  refresh(_: string) {
    const email = 'test@email.com';
    return this.cookieService.setCookie(email);
  },

  async removeRefreshToken(_: string) {
    return 1;
  },
});

type MockAuthService = Awaited<ReturnType<typeof mockAuthService>>;

export { mockAuthService };
export type { MockAuthService };
