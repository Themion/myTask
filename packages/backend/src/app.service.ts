import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getFooBar() {
    return { foo: 'bar' };
  }
}
