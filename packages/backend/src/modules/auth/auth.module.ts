import { Module } from '@nestjs/common';
import { GroupModule } from '~/modules/group/group.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { SignInModule } from './signin/signin.module';
import { SignUpModule } from './signup/signup.module';
import { JwtStrategy } from './strategy';

@Module({
  imports: [GroupModule, SignUpModule, SignInModule],
  providers: [AuthService, CookieService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
