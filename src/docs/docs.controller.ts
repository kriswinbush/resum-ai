import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Render,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DocsService } from './docs.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  async getadoc() {
    /* const f = await this.docsService.getDocFromUrl(
      'https://arxiv.org/pdf/2401.02385.pdf',
    ); */
    //console.log(f);
    console.log('get a doc was called');
  }

  @Get()
  @UseGuards(AuthGuard)
  @Render('./partials/upload')
  getDocs(): { message: string } {
    this.getadoc();
    return { message: 'Docs' };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  uploadFile(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    console.log(body);
    console.log(file);
  }
}
