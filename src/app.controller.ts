import { Controller, Get, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('./partials/index')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('topics')
  /* @Render('./partials/index') */
  getGoodbye(@Res() res: Response) {
    return res.render('./partials/index', { message: 'GoodBye' });
  }
}
