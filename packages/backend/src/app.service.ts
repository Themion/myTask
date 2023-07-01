import { hello } from '@my-task/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { hello: hello() };
  }
}
