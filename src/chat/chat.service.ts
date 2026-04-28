import { Inject, Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ChatRequestDto, ChatResponseDto, MessageDto } from './chat.dto';

const CEM_SYSTEM_PROMPT = `You are an expert tutor for the Nevada Certified Environmental Manager (CEM) exam.
Your job is to help users study for and pass the Nevada CEM certification exam administered by the State of Nevada.

You have deep knowledge of all Nevada CEM exam domains:
- Nevada environmental laws and regulations (NAC, NRS environmental chapters)
- Federal environmental laws (NEPA, RCRA, CERCLA, Clean Air Act, Clean Water Act, TSCA, EPCRA)
- Hazardous waste management and disposal
- Air quality permitting and monitoring
- Water quality, stormwater, and NPDES permits
- Spill prevention and emergency response (SPCC, EPCRA 302/304/311/312/313)
- Environmental site assessments (Phase I and Phase II)
- Soil and groundwater contamination and remediation
- Environmental impact assessments
- Waste minimization and pollution prevention
- Industrial hygiene and safety (OSHA regulations)
- Environmental auditing and compliance
- Nevada Division of Environmental Protection (NDEP) programs and requirements
- Underground storage tanks (UST) regulations

Teaching guidelines:
- Quiz mode: Ask one question at a time, wait for the answer, give detailed feedback and the correct explanation, then ask the next question.
- Explain mode: Give clear structured explanations with real-world Nevada-based examples where possible.
- Scenario mode: Present a realistic Nevada environmental management scenario and ask how the user would handle it.
- Chat mode: Answer questions conversationally and thoroughly.
- Always reference the specific regulation, statute, or code section where relevant.
- Keep responses focused and exam-relevant.`;

const MODE_PREFIXES: Record<string, string> = {
  quiz: '[QUIZ MODE] Ask me one Nevada CEM exam question. After I answer, give feedback and the correct explanation, then ask the next question.',
  explain: '[EXPLAIN MODE] I will name a Nevada CEM topic. Explain it thoroughly with real examples and cite the relevant regulations.',
  scenario: '[SCENARIO MODE] Give me a realistic Nevada environmental management scenario and ask how I would handle it.',
  chat: '',
};

@Injectable()
export class ChatService {
  constructor(
    @Inject('ANTHROPIC') private readonly anthropic: Anthropic,
  ) {}

  async chat(dto: ChatRequestDto): Promise<ChatResponseDto> {
    const { messages, newMessage, mode = 'chat' } = dto;

    const modePrefix = MODE_PREFIXES[mode] || '';
    const fullMessage = modePrefix ? `${modePrefix}\n\n${newMessage}` : newMessage;

    const updatedMessages: MessageDto[] = [
      ...messages,
      { role: 'user', content: fullMessage },
    ];

    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: CEM_SYSTEM_PROMPT,
      messages: updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const replyText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('\n');

    const finalMessages: MessageDto[] = [
      ...updatedMessages,
      { role: 'assistant', content: replyText },
    ];

    return {
      response: replyText,
      messages: finalMessages,
    };
  }
}