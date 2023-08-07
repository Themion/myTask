import {
  Controller,
  Delete,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '~/constants';
import { JwtGuard } from '~/guard';
import { AuthService } from '~/modules/auth/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[REFRESH_TOKEN];
    if (!refreshToken) throw new UnauthorizedException('Logout by timeout!');

    const cookieSettings = await this.authService.refresh(refreshToken);

    for (const [key, { val, options }] of Object.entries(cookieSettings))
      res.cookie(key, val, options);
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
