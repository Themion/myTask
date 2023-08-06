import { Module } from '@nestjs/common';
import { CookieService } from '~/modules/auth/cookie.service';
import { GroupModule } from '~/modules/group/group.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInModule } from './signin/signin.module';
import { SignUpModule } from './signup/signup.module';

@Module({
  imports: [GroupModule, SignUpModule, SignInModule],
  providers: [AuthService, CookieService],
  controllers: [AuthController],
})
export class AuthModule {}
