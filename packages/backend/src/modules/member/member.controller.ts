import { inviteMemberDTOSchema, leaveMemberDTOSchema } from '@my-task/common';
import { BadRequestException, Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { Email } from '~/decorators';
import { JwtGuard } from '~/guard';
import { EmailService } from '~/modules/email/email.service';
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
  async invite(@Body() body: any) {
    const result = inviteMemberDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    this.sendEmail(data.email);

    return this.memberService.createMemberByEmail(data.groupId, data.email);
  }

  @UseGuards(JwtGuard)
  @Delete()
  async leave(@Email() email: string, @Body() body: any) {
    const result = leaveMemberDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    return this.memberService.softDeleteMemberByEmail(data.groupId, email);
  }
}
