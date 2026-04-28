export declare class MessageDto {
    role: 'user' | 'assistant';
    content: string;
}
export declare class ChatRequestDto {
    messages: MessageDto[];
    newMessage: string;
    mode?: 'chat' | 'quiz' | 'explain' | 'scenario';
}
export declare class ChatResponseDto {
    response: string;
    messages: MessageDto[];
}
