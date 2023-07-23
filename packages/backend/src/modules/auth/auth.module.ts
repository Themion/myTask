import { Module } from '@nestjs/common';
import { GroupModule } from '~/modules/group/group.module';
import { SignInModule } from './SignIn/SignIn.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpModule } from './signup/signup.module';

@Module({
  imports: [GroupModule, SignUpModule, SignInModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
