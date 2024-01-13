import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Render,
  UseInterceptors,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { FoundException } from './found.exception';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  @Render('./partials/login')
  auth() {
    return { message: 'authroute' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @UseInterceptors(NoFilesInterceptor())
  async signIn(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { email, password } = req.body;
    const access_token = await this.authService.signIn(email, password);

    if (!access_token) {
      res.setHeader('location', '/auth');
      throw new FoundException('Redirecting you to login...');
    }
    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 96 * 60 * 1000),
      })
      .setHeader('HX-Redirect', '/docs')
      .send({ status: 'ok' });
  }
}
