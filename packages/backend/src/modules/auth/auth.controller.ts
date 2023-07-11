import { createUserConfirmDTO, createUserDTO } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '~/modules/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  createUser(@Body() body: any) {
    const parsedBody = createUserDTO.safeParse(body);
    if (!parsedBody.success) throw new BadRequestException('Wrong DTO: try again!');
    this.authService.createUser(parsedBody.data);
    return parsedBody.data;
  }

  @Post('confirm')
  createUserConfirm(@Body() body: any) {
    const parsedBody = createUserConfirmDTO.safeParse(body);
    if (!parsedBody.success) throw new BadRequestException('Wrong DTO: try again!');
    return this.authService.createUserConfirm(parsedBody.data);
  }
}
