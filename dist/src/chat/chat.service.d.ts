import Anthropic from '@anthropic-ai/sdk';
import { ChatRequestDto, ChatResponseDto } from './chat.dto';
export declare class ChatService {
    private readonly anthropic;
    constructor(anthropic: Anthropic);
    chat(dto: ChatRequestDto): Promise<ChatResponseDto>;
}
