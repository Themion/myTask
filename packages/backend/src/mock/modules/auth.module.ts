import { Test } from '@nestjs/testing';
import { MockAuthService } from '~/mock/services';
import { AuthController } from '~/modules/auth/auth.controller';
import { AuthService } from '~/modules/auth/auth.service';
import { CookieService } from '~/modules/auth/cookie.service';
import { JwtStrategy } from '~/modules/auth/strategy';
import { CacheService } from '~/modules/cache/cache.service';
import mockConfigModule from './config.module';
import mockJwtModule from './jwt.module';

type Props = {
  authService?: MockAuthService;
};

const mockAuthModule = async ({ authService }: Props) => {
  const useController = !!authService;
  const controllers = useController ? [AuthController] : [];

  const moduleFactory = Test.createTestingModule({
    imports: [await mockConfigModule(), await mockJwtModule()],
    providers: [AuthService, CookieService, CacheService, JwtStrategy],
    controllers,
  });

  if (authService) moduleFactory.overrideProvider(AuthService).useValue(authService);

  return moduleFactory.compile();
};

export default mockAuthModule;
