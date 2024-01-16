import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { BrainModule } from 'src/brain/brain.module';
@Module({
  imports: [BrainModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
