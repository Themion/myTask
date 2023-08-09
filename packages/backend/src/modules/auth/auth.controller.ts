import { confirmAuthDTOSchema, requestAuthDTOSchema } from '@my-task/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants';
import { JwtGuard } from '~/guard';
import { AuthService } from '~/modules/auth/auth.service';
import { CookieService } from '~/modules/auth/cookie.service';
import { EmailService } from '~/modules/email/email.service';
import { CookieSettings, Env } from '~/types';

@Controller()
export class AuthController {
  private readonly FE_ORIGIN: string;

  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly emailService: EmailService,
    configService: ConfigService<Env>,
  ) {
    const { HOST, FE_PORT } = configService.getOrThrow<Env['NETWORK']>('NETWORK');
    this.FE_ORIGIN = `http://${HOST}:${FE_PORT}`;
  }

  private sendEmail(receiver: string, uuid: string) {
    return this.emailService.sendEmail(
      receiver,
      '[MyTask] Please verify your E-Mail!',
      `Click <a href="${this.FE_ORIGIN}/signin/${uuid}">HERE</a> to verify your E-Mail!`,
    );
  }

  private setAuthCookie(res: Response, cookieSettings: CookieSettings) {
    for (const [key, { val, options }] of Object.entries(cookieSettings))
      res.cookie(key, val, options);
  }

  @Post('request')
  async request(@Body() body: any) {
    const result = requestAuthDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const uuid = await this.authService.request(data);
    // E-Mail 송신은 동기적으로 진행할 필요 없음
    this.sendEmail(data.email, uuid);

    return data;
  }

  @Post('confirm')
  async confirm(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const result = confirmAuthDTOSchema.safeParse(body);
    if (!result.success) throw new BadRequestException('Wrong DTO: try again!');
    const { data } = result;

    const authInfo = await this.authService.confirm(data);

    const cookieSettings = await this.cookieService.setCookie(authInfo.email);
    this.setAuthCookie(res, cookieSettings);

    return authInfo;
  }

  @Get()
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    if (!refreshToken) throw new UnauthorizedException('Logout by timeout!');

    const cookieSettings = await this.authService.refresh(refreshToken);
    this.setAuthCookie(res, cookieSettings);

    return { refreshed: true };
  }

  @UseGuards(JwtGuard)
  @Delete()
  async signOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // undefined일 경우 어차피 무시됨
    const refreshToken = req.cookies[REFRESH_TOKEN] as string;

    await this.authService.removeRefreshToken(refreshToken);
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);

    return { refreshed: false };
  }
}
