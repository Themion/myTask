import { Controller, Get } from '@nestjs/common';
import { AppService } from '~/modules/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getFooBar() {
    return this.appService.getFooBar();
  }
}
