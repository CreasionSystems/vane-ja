import { getLanguageMeta, Locale } from './languages';

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31536000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1],
];

/*
 * Intl handles both the unit names and the "ago" wording, which English glues
 * on at the call site and Japanese expresses as a 前 suffix instead.
 */
export const formatRelativeTime = (
  locale: Locale,
  from: Date | string,
  to: Date | string,
): string => {
  const diffInSeconds = Math.floor(
    Math.abs(new Date(to).getTime() - new Date(from).getTime()) / 1000,
  );

  const [unit, seconds] =
    UNITS.find(([, s]) => diffInSeconds >= s) ?? UNITS[UNITS.length - 1];

  const formatter = new Intl.RelativeTimeFormat(
    getLanguageMeta(locale).intlLocale,
    { numeric: 'always' },
  );

  return formatter.format(-Math.floor(diffInSeconds / seconds), unit);
};

export const formatDateTime = (locale: Locale, date: Date | string): string =>
  new Date(date).toLocaleString(getLanguageMeta(locale).intlLocale);
