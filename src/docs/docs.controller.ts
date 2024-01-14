import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Render,
  Body,
  UseGuards,
  Param,
  Res,
  Query,
  Delete,
} from '@nestjs/common';
import { DocsService } from './docs.service';
import { ProcessingService } from 'src/processing/processing.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Response } from 'express';
import { Transform, pipeline } from 'stream';

const fsp = fs.promises;

@Controller('docs')
export class DocsController {
  constructor(
    private readonly docsService: DocsService,
    private readonly processingService: ProcessingService,
  ) { }

  @Get()
  @UseGuards(AuthGuard)
  @Render('./partials/upload')
  async getDocs() {
    const fileInfo = await this.docsService.getFilesInfo();
    console.log(fileInfo);
    return { files: fileInfo };
  }

  @Delete('/file/:id')
  async deleteFile(@Res() res: Response, @Param('id') id) {
    await this.docsService.deleteFile(id);
    res.setHeader('HX-Trigger', 'updateList');
    res.send();
  }

  @Get('/embed/:id')
  async embedFile(@Param('id') id /* , @Res() res: Response */) {
    console.log(id);
    const gfsFile = await this.docsService.getFile(id);
    // should all file extensions be allowed?
    const writeFs = fs.createWriteStream('./public/images/temp.pdf');
    let file;
    pipeline(gfsFile, writeFs, async (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('done');
      file = fs.readFileSync('public/images/temp.pdf');
      console.log(file);
      this.processingService.pdfToLangchainDoc(file);
      await fsp.unlink('public/images/temp.pdf');
      return;
    });
    return;
  }

  @Get('/file/:id')
  async getFile(
    @Param('id') id,
    @Query('contenttype') contenttype: string,
    @Res() res: Response,
  ) {
    const ext: any = /[^/]+$/g.exec(contenttype);
    const gfsFile = await this.docsService.getFile(id);
    // unlink file???
    const stream = fs.createWriteStream(
      `./public/images/${id}.${ext[0] === 'jpeg' ? 'jpg' : ext}`,
      {},
    );
    const tap = new Transform({
      transform(chunk, encoding, callback) {
        // console.log(chunk);
        callback(null, chunk);
      },
    });

    pipeline(gfsFile, tap, stream, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('pipeline finished');

        switch (contenttype) {
          case 'image/jpeg':
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(`<img class="m-auto h-28" src="images/${id}.jpg" />`);
            break;
          case 'image/png':
            res.setHeader('Content-Type', 'image/png');
            res.send(`<img class="m-auto h-28" src="images/${id}.png" />`);
            break;
          case 'image/webp':
            res.setHeader('Content-Type', 'image/webp');
            break;
          case 'application/pdf':
            res.setHeader('Content-Type', 'application/pdf');
            res.send(
              `<embed src="images/${id}.pdf" width="100%" height="100%" />`,
            );
            break;
          default:
            // res.set('Content-Type', 'image/jpeg');
            break;
        }
      }
    });
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(
    @Res() res: Response,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    res.setHeader('HX-Trigger', 'updateList');
    console.log('the file from upload');
    console.log(file);
    const upload = await this.docsService.uploadFile(file);
    console.log('what is upload, a promise?');
    console.log(upload);
    fs.unlinkSync(`./uploads/${file.filename}`);
    res.send({ message: 'File uploaded', status: 'ok', data: file.path });
  }
}
