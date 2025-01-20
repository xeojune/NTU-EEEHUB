import { Injectable } from '@nestjs/common';
//backend
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
