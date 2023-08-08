import { Module } from '@nestjs/common';
import { GroupModule } from '~/modules/group/group.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [GroupModule],
  providers: [AuthService, CookieService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
