import { Module } from '@nestjs/common';
import { MemberModule } from '~/modules/member/member.module';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [MemberModule],
  providers: [GroupService],
  exports: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
