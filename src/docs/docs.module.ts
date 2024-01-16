import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer-config.service';
import { ProcessingService } from 'src/processing/processing.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    /* MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }), */
  ],
  controllers: [DocsController],
  providers: [DocsService, ProcessingService],
})
export class DocsModule {}
