import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';

@Module({
  providers: [MemberService],
  exports: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
