import { Injectable } from '@nestjs/common';
import { hello } from '@my-task/common';

@Injectable()
export class AppService {
  getHello(): string {
    return hello();
  }
}
