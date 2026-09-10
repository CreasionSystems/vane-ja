import { DEFAULT_LOCALE, getLanguageMeta, Locale } from '@/lib/i18n/languages';

/*
 * English is the language every upstream prompt was written for, so it gets no
 * extra instruction at all and behaves exactly like the unmodified prompts.
 */
const isDefault = (locale: Locale) => locale === DEFAULT_LOCALE;

/* Appended to prompts whose output is shown to the user verbatim. */
export const getWriterLanguageInstruction = (locale: Locale) => {
  if (isDefault(locale)) return '';

  const { llmName } = getLanguageMeta(locale);

  return `
    ### Language (highest priority)
    - Write the ENTIRE response in ${llmName}, including every heading, bullet, table cell and the closing summary.
    - Do this even when the search results, the context and the user's own message are in another language: translate what you need rather than quoting it untranslated.
    - Keep proper nouns, company and product names, code, identifiers and URLs in their original form.
    - Keep technical terms in the form they are normally written in ${llmName}; do not force a translation that native writers would not use.
    - Source titles may stay in their original language, but your own sentences about them must be in ${llmName}.
    - Citation markers stay exactly as [1], [2] — never translate or reformat them.
`;
};

/* Appended to prompts that drive tool use and write search engine queries. */
export const getResearchLanguageInstruction = (locale: Locale) => {
  if (isDefault(locale)) return '';

  const { llmName } = getLanguageMeta(locale);

  return `
  <language>
  The user is reading in ${llmName}. Any text you produce that reaches the user — reasoning preambles and plans in particular — must be written in ${llmName}.

  Search queries are a separate decision, made per query:
  - Use ${llmName} keywords when the topic is local to that language's region, culture, market, law or media, or when the best sources are written in it.
  - Use English keywords for international technical topics, product names, research and software, where English sources dominate.
  - Issuing both a ${llmName} query and an English query for the same topic is a good way to use your query budget when you are unsure.
  </language>
`;
};

/* Appended to the suggestion generator, whose output becomes clickable chips. */
export const getSuggestionsLanguageInstruction = (locale: Locale) => {
  if (isDefault(locale)) return '';

  const { llmName } = getLanguageMeta(locale);

  return `
Write every suggestion in ${llmName}. Keep proper nouns and product names in their original form.
`;
};

/* Appended to the classifier so the rewritten question keeps its language. */
export const getClassifierLanguageInstruction = (locale: Locale) => {
  if (isDefault(locale)) return '';

  const { llmName } = getLanguageMeta(locale);

  return `
<language>
The standalone follow-up question must be written in the same language as the user's message, which is normally ${llmName}. Never translate the user's question into English while rewriting it.
</language>
`;
};
