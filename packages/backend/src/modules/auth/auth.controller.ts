import { createUserConfirmDTO, createUserDTO } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '~/modules/email/email.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  createUser(@Body() body: any) {
    const result = createUserDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = this.authService.createUser(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.emailService.sendJoinEmail(data.email, uuid);

    return data;
  }

  @Post('confirm')
  createUserConfirm(@Body() body: any) {
    const result = createUserConfirmDTO.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    return this.authService.createUserConfirm(data);
  }
}
