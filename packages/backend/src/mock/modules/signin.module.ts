import { Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MockSignInService } from '~/mock/services';
import { SignInController } from '~/modules/auth/signin/signin.controller';
import { SignInService } from '~/modules/auth/signin/signin.service';

type Props = {
  signInService?: MockSignInService;
};

const mockSignInModule = async ({ signInService }: Props) => {
  const providers: Provider[] = [SignInService];

  const useController = !!signInService;
  const controllers = useController ? [SignInController] : [];

  const moduleFactory = Test.createTestingModule({
    providers,
    controllers,
  });

  if (signInService) moduleFactory.overrideProvider(SignInService).useValue(signInService);

  return moduleFactory.compile();
};

export default mockSignInModule;
