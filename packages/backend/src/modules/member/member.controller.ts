import { inviteMemberDTOSchema } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
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

  @Post()
  async invite(@Body() body: any) {
    const result = inviteMemberDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    this.sendEmail(data.email);

    return this.memberService.createMemberByEmail(data.groupId, data.email);
  }
}
