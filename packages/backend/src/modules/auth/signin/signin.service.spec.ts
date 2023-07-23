import { RequestSignInDTO } from '@my-task/common';
import { z } from 'zod';
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

  describe('requestSignIn', () => {
    it('should work (validation will be done in controller)', async () => {
      const userToAdd: RequestSignInDTO = { email: 'create@example.email' };

      const result = await service.requestSignIn(userToAdd);
      const parsedResult = z.string().uuid().safeParse(result);
      expect(parsedResult.success).toEqual(true);
    });
  });
});
