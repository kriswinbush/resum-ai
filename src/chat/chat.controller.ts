import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { BrainService } from 'src/brain/brain.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly brainService: BrainService) {}

  @Get()
  @Render('./partials/chat')
  async getChat() {
    return { data: 'hello from chat' };
  }

  @Post('/message')
  @UseInterceptors(NoFilesInterceptor())
  async postMessage(@Body() body: any) {
    console.log(body);
    const res = await this.brainService.getStandAloneQuestion(body.prompt);
    /* const res2 =
      await this.brainService.getMatchingDocsVectorsFromMongoDBVectorStore(); */
    console.log(res);
    return { data: 'hello from chat' };
  }
}
