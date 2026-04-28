import { Module } from '@nestjs/common';
import { anthropicProvider } from '../config/anthropic.provider';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

// This module bundles the Anthropic provider, service, and controller together.
// The article registered its OpenAI provider in a similar providers array.
@Module({
  controllers: [ChatController],
  providers: [anthropicProvider, ChatService],
})
export class ChatModule {}
