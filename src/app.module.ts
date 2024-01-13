import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DocsModule } from './docs/docs.module';
import { ProcessingService } from './processing/processing.service';
@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UsersModule, DocsModule],
  controllers: [AppController],
  providers: [AppService, ProcessingService],
})
export class AppModule {}
