import { createUserDTO } from '@my-task/common';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '~/modules/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  createUser(@Body() body: any) {
    try {
      return this.authService.createUser(createUserDTO.parse(body));
    } catch (error) {
      throw new BadRequestException('Wrong DTO: try again!');
    }
  }
}
