import { Module } from '@nestjs/common';
import { GroupModule } from '~/modules/group/group.module';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';

@Module({
  imports: [GroupModule],
  controllers: [SignupController],
  providers: [SignupService],
})
export class SignupModule {}
