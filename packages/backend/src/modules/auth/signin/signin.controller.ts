import { confirmSignInDTOSchema, requestSignUpDTOSchema } from '@my-task/common';
import { BadRequestException, Body, Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CookieService } from '~/modules/auth/cookie.service';
import { EmailService } from '~/modules/email/email.service';
import { Env } from '~/types';
import { SignInService } from './signin.service';

@Controller()
export class SignInController {
  private readonly FE_ORIGIN: string;

  constructor(
    private readonly signInService: SignInService,
    private readonly cookieService: CookieService,
    private readonly emailService: EmailService,
    configService: ConfigService<Env>,
  ) {
    const { HOST, FE_PORT } = configService.getOrThrow<Env['NETWORK']>('NETWORK');
    this.FE_ORIGIN = `http://${HOST}:${FE_PORT}`;
  }

  private sendSignInEmail(receiver: string, uuid: string) {
    return this.emailService.sendEmail(
      receiver,
      '[MyTask] Please verify your E-Mail!',
      `Click <a href="${this.FE_ORIGIN}/signin/${uuid}">HERE</a> to verify your E-Mail!`,
    );
  }

  @Post('syn')
  async requestSignIn(@Body() body: any) {
    const result = requestSignUpDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = await this.signInService.requestSignIn(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.sendSignInEmail(data.email, uuid);

    return data;
  }

  @Post('ack')
  async confirmSignIn(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const result = confirmSignInDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const signedUser = await this.signInService.confirmSignIn(data);

    const cookieSettings = await this.cookieService.setCookie(signedUser.email);
    for (const [key, { val, options }] of Object.entries(cookieSettings))
      res.cookie(key, val, options);

    return signedUser;
  }
}
