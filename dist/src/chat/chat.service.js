"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const sdk_1 = require("@anthropic-ai/sdk");
const CEM_SYSTEM_PROMPT = `You are an expert CEM (Certified Energy Manager) exam tutor.
Your job is to help users study for and pass the AEE CEM certification exam.

You have deep knowledge of all CEM exam domains:
- Energy auditing and assessments (ASHRAE levels 1, 2, 3)
- Energy accounting and economics (life cycle cost, simple payback, ROI, NPV, IRR)
- Electrical systems (motors, lighting, power factor, demand charges, utility rates)
- HVAC systems (chillers, boilers, heat pumps, controls, psychrometrics)
- Building envelope and thermal performance
- Compressed air, steam, and process systems
- Renewable energy and cogeneration
- Measurement & Verification (IPMVP options A, B, C, D)
- Energy management programs and ISO 50001
- Codes and standards (ASHRAE 90.1, ENERGY STAR, LEED)

Teaching guidelines:
- Quiz mode: Ask one question at a time, wait for the answer, give detailed feedback, then ask the next.
- Explain mode: Give clear structured explanations with real-world examples and relevant formulas.
- Scenario mode: Present a realistic energy management scenario and ask how the user would approach it.
- Chat mode: Answer questions conversationally and thoroughly.
- Always reference relevant formulas, units, and typical industry values.
- Keep responses focused and exam-relevant.`;
const MODE_PREFIXES = {
    quiz: '[QUIZ MODE] Ask me one CEM exam question. After I answer, give feedback and the correct explanation, then ask the next question.',
    explain: '[EXPLAIN MODE] I will name a CEM topic. Explain it thoroughly with examples, formulas, and exam tips.',
    scenario: '[SCENARIO MODE] Give me a realistic energy management scenario and ask how I would approach it.',
    chat: '',
};
let ChatService = class ChatService {
    constructor(anthropic) {
        this.anthropic = anthropic;
    }
    async chat(dto) {
        const { messages, newMessage, mode = 'chat' } = dto;
        const modePrefix = MODE_PREFIXES[mode] || '';
        const fullMessage = modePrefix ? `${modePrefix}\n\n${newMessage}` : newMessage;
        const updatedMessages = [
            ...messages,
            { role: 'user', content: fullMessage },
        ];
        const response = await this.anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: CEM_SYSTEM_PROMPT,
            messages: updatedMessages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
        });
        const replyText = response.content
            .filter((block) => block.type === 'text')
            .map((block) => block.text)
            .join('\n');
        const finalMessages = [
            ...updatedMessages,
            { role: 'assistant', content: replyText },
        ];
        return {
            response: replyText,
            messages: finalMessages,
        };
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ANTHROPIC')),
    __metadata("design:paramtypes", [sdk_1.default])
], ChatService);
//# sourceMappingURL=chat.service.js.map