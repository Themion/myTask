import { Controller, Get, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { REFRESH_TOKEN } from '~/constants';
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
}
