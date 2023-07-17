import { Module } from '@nestjs/common';
import { GroupModule } from '~/modules/group/group.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// sign up / sign in / sign out
@Module({
  imports: [GroupModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
