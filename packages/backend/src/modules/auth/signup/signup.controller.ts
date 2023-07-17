import { confirmJoinUserDTO, requestJoinUserDTO } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '~/modules/email/email.service';
import { GroupService } from '~/modules/group/group.service';
import { SignupService } from './signup.service';

@Controller('signup')
export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly emailService: EmailService,
    private readonly groupService: GroupService,
  ) {}

  @Post('syn')
  requestJoinUser(@Body() body: any) {
    const result = requestJoinUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = this.signupService.requestJoinUser(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.emailService.sendJoinEmail(data.email, uuid);

    return data;
  }

  @Post('ack')
  async confirmJoinUser(@Body() body: any) {
    const result = confirmJoinUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const newUser = await this.signupService.confirmJoinUser(data);
    await this.groupService.createGroup(newUser);

    return newUser;
  }
}
