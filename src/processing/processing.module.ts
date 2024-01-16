import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcessingService } from './processing.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingModule {}
