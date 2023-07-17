import { Module } from '@nestjs/common';
import { GroupModule } from '~/modules/group/group.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupModule } from './signup/signup.module';

@Module({
  imports: [GroupModule, SignupModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
