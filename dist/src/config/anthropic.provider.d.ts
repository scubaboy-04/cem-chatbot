import Anthropic from '@anthropic-ai/sdk';
export declare const anthropicProvider: {
    provide: string;
    useFactory: () => Anthropic;
};
