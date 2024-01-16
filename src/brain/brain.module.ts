import { Module } from '@nestjs/common';
import { BrainService } from './brain.service';
import { ConfigModule } from '@nestjs/config';
import { ProcessingModule } from '../processing/processing.module';
@Module({
  imports: [ConfigModule.forRoot(), ProcessingModule],
  providers: [BrainService],
  exports: [BrainService],
})
export class BrainModule {}
