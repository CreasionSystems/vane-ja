export type Locale = 'en' | 'ja';

export const DEFAULT_LOCALE: Locale = 'en';

export type LanguageMeta = {
  code: Locale;
  /* Label shown in the language dropdown, written in the language itself */
  label: string;
  /* Value passed to SearXNG's `language` search parameter */
  searxngCode: string;
  /* How the language is named to the LLM when telling it what to answer in */
  llmName: string;
  /* Value for the <html lang> attribute */
  htmlLang: string;
  /* Locale tag used for date/number formatting */
  intlLocale: string;
};

export const languages: Record<Locale, LanguageMeta> = {
  en: {
    code: 'en',
    label: 'English',
    searxngCode: 'en',
    llmName: 'English',
    htmlLang: 'en',
    intlLocale: 'en-US',
  },
  ja: {
    code: 'ja',
    label: '日本語',
    searxngCode: 'ja',
    llmName: 'Japanese (日本語)',
    htmlLang: 'ja',
    intlLocale: 'ja-JP',
  },
};

export const LOCALE_STORAGE_KEY = 'language';
export const LOCALE_COOKIE_KEY = 'language';

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' &&
  Object.prototype.hasOwnProperty.call(languages, value);

export const normalizeLocale = (value: unknown): Locale =>
  isLocale(value) ? value : DEFAULT_LOCALE;

export const getLanguageMeta = (value: unknown): LanguageMeta =>
  languages[normalizeLocale(value)];

export const localeOptions = Object.values(languages).map((l) => ({
  name: l.label,
  value: l.code,
}));
