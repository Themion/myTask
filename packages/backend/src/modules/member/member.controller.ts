import {
  InviteMemberDTO,
  LeaveMemberDTO,
  PageInfo,
  getPageInfoSchema,
  inviteMemberDTOSchema,
  leaveMemberDTOSchema,
} from '@my-task/common';
import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Email, ParsedBody } from '~/decorators';
import { JwtGuard } from '~/guard';
import { EmailService } from '~/modules/email/email.service';
import { ZodParsePipe } from '~/pipe';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly emailService: EmailService,
  ) {}

  private sendEmail(receiver: string) {
    return this.emailService.sendEmail(
      receiver,
      '[MyTask] You are invited!',
      `You are invited to a group!`,
    );
  }

  @UseGuards(JwtGuard)
  @Post()
  async invite(@ParsedBody(inviteMemberDTOSchema) body: InviteMemberDTO) {
    this.sendEmail(body.email);
    return this.memberService.createMemberByEmail(body.groupId, body.email);
  }

  @UseGuards(JwtGuard)
  @Delete()
  async leave(@Email() email: string, @ParsedBody(leaveMemberDTOSchema) body: LeaveMemberDTO) {
    return this.memberService.softDeleteMemberByEmail(body.groupId, email);
  }

  @UseGuards(JwtGuard)
  @Get(':groupId')
  async findMemberByGroupId(
    @Email() email: string,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query(new ZodParsePipe(getPageInfoSchema(30))) query: Partial<PageInfo> = {},
  ) {
    const { offset } = query;
    const userId = await this.memberService.findIfUserIsMember(groupId, email);
    if (userId < 0)
      throw new ForbiddenException(`User ${email} is not a member of Group #${groupId}`);
    return this.memberService.findMemberByGroupId(groupId, { offset });
  }
}
