"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anthropicProvider = void 0;
const sdk_1 = require("@anthropic-ai/sdk");
exports.anthropicProvider = {
    provide: 'ANTHROPIC',
    useFactory: () => {
        return new sdk_1.default({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
    },
};
//# sourceMappingURL=anthropic.provider.js.map