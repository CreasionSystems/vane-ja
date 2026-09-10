'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_LOCALE,
  getLanguageMeta,
  Locale,
  LOCALE_COOKIE_KEY,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
} from './languages';
import {
  Dictionary,
  translate,
  translateOr,
  TranslateVars,
} from './translate';

export type { Dictionary, TranslateVars };
export { translate, translateOr };

export const readStoredLocale = (): Locale => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  try {
    return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return DEFAULT_LOCALE;
  }
};

/*
 * Mirrored into a cookie so the server can render the first paint in the right
 * language instead of flashing English before hydration.
 */
const syncLocaleCookie = (locale: Locale) => {
  if (typeof document === 'undefined') return;

  document.cookie =
    `${LOCALE_COOKIE_KEY}=${locale}; path=/; ` +
    'max-age=31536000; samesite=lax';
};

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: TranslateVars) => string;
  tOr: (key: string, fallback: string, vars?: TranslateVars) => string;
};

const i18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const applyLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    syncLocaleCookie(next);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = getLanguageMeta(next).htmlLang;
    }
  }, []);

  useEffect(() => {
    /* localStorage stays the source of truth; the cookie can lag behind */
    applyLocale(readStoredLocale());

    const sync = () => applyLocale(readStoredLocale());

    window.addEventListener('client-config-changed', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('client-config-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, [applyLocale]);

  const setLocale = useCallback(
    (next: Locale) => {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, next);
      } catch {
        /* Private browsing modes can reject writes; keep the in-memory value */
      }
      applyLocale(next);
    },
    [applyLocale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key: string, vars?: TranslateVars) => translate(locale, key, vars),
      tOr: (key: string, fallback: string, vars?: TranslateVars) =>
        translateOr(locale, key, fallback, vars),
    }),
    [locale, setLocale],
  );

  return <i18nContext.Provider value={value}>{children}</i18nContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(i18nContext);

  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }

  return context;
};

export const useLocaleMeta = () => getLanguageMeta(useTranslation().locale);
