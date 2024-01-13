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
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { Response } from 'express';
import { Transform, pipeline } from 'stream';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

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

  @Get('/file/:id')
  async getFile(
    @Param('id') id,
    @Query('contenttype') contenttype: string,
    @Res() res: Response,
  ) {
    const ext: any = /[^/]+$/g.exec(contenttype);
    const gfsFile = await this.docsService.getFile(id);
    const stream = fs.createWriteStream(
      `./public/images/${id}.${ext[0] === 'jpeg' ? 'jpg' : ext}`,
      {},
    );
    const tap = new Transform({
      transform(chunk, encoding, callback) {
        console.log(chunk);
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
  @Post('upload')
  uploadFile(
    @Res() res: Response,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    res.setHeader('HX-Trigger', 'updateList');
    console.log(file);
    const r = this.docsService.uploadFile(file);
    console.log(r);

    res.send({ message: 'File uploaded', status: 'ok', data: file.path });
  }
}
