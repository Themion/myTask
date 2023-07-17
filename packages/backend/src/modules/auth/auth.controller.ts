import { confirmJoinUserDTO, requestJoinUserDTO } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '~/modules/email/email.service';
import { GroupService } from '~/modules/group/group.service';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly groupService: GroupService,
  ) {}

  @Post('join/syn')
  requestJoinUser(@Body() body: any) {
    const result = requestJoinUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = this.authService.requestJoinUser(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.emailService.sendSignUpEmail(data.email, uuid);

    return data;
  }

  @Post('join/ack')
  async confirmJoinUser(@Body() body: any) {
    const result = confirmJoinUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const newUser = await this.authService.confirmJoinUser(data);
    await this.groupService.createGroup(newUser);

    return newUser;
  }
}
