import { Locale } from './languages';
import en from './locales/en';
import ja from './locales/ja';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ja };

export type TranslateVars = Record<string, string | number>;

const lookup = (dict: unknown, key: string): string | undefined => {
  const value = key
    .split('.')
    .reduce<any>(
      (acc, part) => (acc == null ? undefined : acc[part]),
      dict as any,
    );

  return typeof value === 'string' ? value : undefined;
};

const interpolate = (template: string, vars?: TranslateVars) => {
  if (!vars) return template;

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name)
      ? String(vars[name])
      : match,
  );
};

/*
 * Falls back to English before falling back to the key itself so a missing
 * translation degrades into readable text rather than a dotted path.
 */
export const translate = (
  locale: Locale,
  key: string,
  vars?: TranslateVars,
): string => {
  const value =
    lookup(dictionaries[locale], key) ?? lookup(dictionaries.en, key);

  if (value === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n] Missing translation for "${key}"`);
    }
    return key;
  }

  return interpolate(value, vars);
};

/*
 * Some strings reach the client already rendered in English by the server
 * (config field labels, for instance). Those look up a key and keep the
 * server's own text when no translation exists, instead of showing the key.
 */
export const translateOr = (
  locale: Locale,
  key: string,
  fallback: string,
  vars?: TranslateVars,
): string => {
  const value =
    lookup(dictionaries[locale], key) ?? lookup(dictionaries.en, key);

  return value === undefined ? fallback : interpolate(value, vars);
};
