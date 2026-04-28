// A single message in the conversation history.
// role: 'user' = human message, 'assistant' = AI reply
export class MessageDto {
  role: 'user' | 'assistant';
  content: string;
}

// The body the frontend POSTs to /chat
// messages = the full conversation history so far (without the new message)
// newMessage = what the user just typed
export class ChatRequestDto {
  messages: MessageDto[];
  newMessage: string;
  mode?: 'chat' | 'quiz' | 'explain' | 'scenario'; // optional study mode
}

// What the API sends back to the frontend
export class ChatResponseDto {
  response: string;       // the AI's reply text
  messages: MessageDto[]; // updated history (including the new exchange)
}
