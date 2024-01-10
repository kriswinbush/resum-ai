import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import path = require('path');
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.setBaseViewsDir(path.join(__dirname, '../', 'views'));
  hbs.registerPartials(path.join(__dirname, '../', 'views/partials'));
  app.setViewEngine('hbs');

  app.useStaticAssets(join(__dirname, '..', '/public'));

  app.set('view options', { layout: 'index' });

  await app.listen(3000);
}
bootstrap();
