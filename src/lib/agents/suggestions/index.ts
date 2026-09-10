import formatChatHistoryAsString from '@/lib/utils/formatHistory';
import { suggestionGeneratorPrompt } from '@/lib/prompts/suggestions';
import { ChatTurnMessage } from '@/lib/types';
import z from 'zod';
import BaseLLM from '@/lib/models/base/llm';
import { DEFAULT_LOCALE, Locale } from '@/lib/i18n/languages';
import { getSuggestionsLanguageInstruction } from '@/lib/prompts/language';

type SuggestionGeneratorInput = {
  chatHistory: ChatTurnMessage[];
  language?: Locale;
};

const schema = z.object({
  suggestions: z
    .array(z.string())
    .describe('List of suggested questions or prompts'),
});

const generateSuggestions = async (
  input: SuggestionGeneratorInput,
  llm: BaseLLM<any>,
) => {
  const res = await llm.generateObject<typeof schema>({
    messages: [
      {
        role: 'system',
        content:
          suggestionGeneratorPrompt +
          getSuggestionsLanguageInstruction(input.language ?? DEFAULT_LOCALE),
      },
      {
        role: 'user',
        content: `<chat_history>\n${formatChatHistoryAsString(input.chatHistory)}\n</chat_history>`,
      },
    ],
    schema,
  });

  return res.suggestions;
};

export default generateSuggestions;
