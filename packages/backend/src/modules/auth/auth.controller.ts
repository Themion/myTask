import { confirmJoinUserDTO, requestJoinUserDTO } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '~/modules/email/email.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('join/syn')
  requestJoinUser(@Body() body: any) {
    const result = requestJoinUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = this.authService.requestJoinUser(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.emailService.sendJoinEmail(data.email, uuid);

    return data;
  }

  @Post('join/ack')
  confirmJoinUser(@Body() body: any) {
    const result = confirmJoinUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    return this.authService.confirmJoinUser(data);
  }
}
