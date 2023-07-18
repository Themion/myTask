import { Module } from '@nestjs/common';
import { CookieService } from '~/modules/auth/cookie.service';
import { SignInController } from './signin.controller';
import { SignInService } from './signin.service';

@Module({
  controllers: [SignInController],
  providers: [SignInService, CookieService],
})
export class SignInModule {}
