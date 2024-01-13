import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessingService {
  getSomething() {
    console.log('ProcessingService.getSomething()');
  }
}
