import { createUserConfirmDTO, createUserDTO, parseWithZod } from '@my-task/common';
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
    const { data, error } = parseWithZod(body, createUserDTO);
    if (!data || error) throw new BadRequestException('Wrong DTO: try again!');

    const uuid = this.authService.createUser(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.emailService.sendJoinEmail(data.email, uuid);

    return data;
  }

  @Post('confirm')
  createUserConfirm(@Body() body: any) {
    const { data, error } = parseWithZod(body, createUserConfirmDTO);
    if (!data || error) throw new BadRequestException('Wrong DTO: try again!');
    return this.authService.createUserConfirm(data);
  }
}
