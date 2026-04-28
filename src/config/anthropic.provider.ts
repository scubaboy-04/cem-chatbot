import Anthropic from '@anthropic-ai/sdk';

// This is the equivalent of the article's chatProviders pattern:
//   { provide: 'OPEN_AI', useFactory: () => new OpenAI() }
// We register Anthropic as an injectable provider using the same approach.
export const anthropicProvider = {
  provide: 'ANTHROPIC',
  useFactory: () => {
    return new Anthropic({
      // Automatically picks up ANTHROPIC_API_KEY from environment,
      // just like the article's OpenAI() constructor picks up OPENAI_API_KEY
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  },
};
