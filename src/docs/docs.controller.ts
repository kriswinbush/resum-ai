import { Controller, Get } from '@nestjs/common';

@Controller('docs')
export class DocsController {
  @Get()
  getDocs(): string {
    return 'Docs';
  }
}
