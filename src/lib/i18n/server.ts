import { cookies } from 'next/headers';
import { Locale, LOCALE_COOKIE_KEY, normalizeLocale } from './languages';

/*
 * The locale lives in localStorage, but it is mirrored into a cookie so server
 * components can render metadata and the first paint in the right language.
 */
export const getRequestLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE_KEY)?.value);
};
