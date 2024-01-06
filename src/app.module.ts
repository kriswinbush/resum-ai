import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocsController } from './docs/docs.controller';
import { DocsService } from './docs/docs.service';

@Module({
  imports: [],
  controllers: [AppController, DocsController],
  providers: [AppService, DocsService],
})
export class AppModule {}
