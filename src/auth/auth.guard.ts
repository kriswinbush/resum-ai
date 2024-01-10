import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { FoundException } from './found.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    let access_token = '';
    if (!request.cookies.access_token) {
      this.respondRedirect(response);
    } else {
      access_token = request.cookies.access_token.access_token;
    }

    try {
      const payload = await this.jwtService.verifyAsync(access_token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      this.respondRedirect(response);
    }
    return true;
  }

  private respondRedirect(response: Response) {
    response.setHeader('location', '/auth');
    throw new FoundException('Redirecting you to login...');
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
