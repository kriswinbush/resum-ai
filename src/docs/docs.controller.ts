import { Controller, Get } from '@nestjs/common';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  async getadoc() {
    const f = await this.docsService.getDocFromUrl(
      'https://arxiv.org/pdf/2401.02385.pdf',
    );
    console.log(f);
  }

  @Get()
  getDocs(): string {
    this.getadoc();
    return 'Docs';
  }
}
