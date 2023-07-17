import { Module } from '@nestjs/common';
import { GroupModule } from '~/modules/group/group.module';
import { SignUpController } from './signup.controller';
import { SignUpService } from './signup.service';

@Module({
  imports: [GroupModule],
  controllers: [SignUpController],
  providers: [SignUpService],
})
export class SignUpModule {}
