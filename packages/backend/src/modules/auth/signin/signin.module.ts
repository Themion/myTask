import { Module } from '@nestjs/common';
import { SignInController } from './signin.controller';
import { SignInService } from './signin.service';

@Module({
  controllers: [SignInController],
  providers: [SignInService],
})
export class SignInModule {}
