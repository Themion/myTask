import { mockSignInModule } from '~/mock';
import { SignInService } from './signin.service';

describe('SignInService', () => {
  let service: SignInService;

  beforeEach(async () => {
    const module = await mockSignInModule({});
    service = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
