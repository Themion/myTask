import { confirmSignUpUserDTO, requestSignUpUserDTO } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '~/modules/email/email.service';
import { GroupService } from '~/modules/group/group.service';
import { SignUpService } from './signup.service';

@Controller('signup')
export class SignUpController {
  constructor(
    private readonly signupService: SignUpService,
    private readonly emailService: EmailService,
    private readonly groupService: GroupService,
  ) {}

  @Post('syn')
  requestSignUpUser(@Body() body: any) {
    const result = requestSignUpUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = this.signupService.requestSignUpUser(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.emailService.sendSignUpEmail(data.email, uuid);

    return data;
  }

  @Post('ack')
  async confirmSignUpUser(@Body() body: any) {
    const result = confirmSignUpUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const newUser = await this.signupService.confirmSignUpUser(data);
    await this.groupService.createGroup(newUser);

    return newUser;
  }
}
