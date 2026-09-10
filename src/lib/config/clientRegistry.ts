'use client';

import {
  DEFAULT_LOCALE,
  Locale,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
} from '../i18n/languages';

const getClientConfig = (key: string, defaultVal?: any) => {
  return localStorage.getItem(key) ?? defaultVal ?? undefined;
};

export const getTheme = () => getClientConfig('theme', 'dark');

export const getLanguage = (): Locale =>
  normalizeLocale(getClientConfig(LOCALE_STORAGE_KEY, DEFAULT_LOCALE));

export const getAutoMediaSearch = () =>
  getClientConfig('autoMediaSearch', 'true') === 'true';

export const getSystemInstructions = () =>
  getClientConfig('systemInstructions', '');

export const getShowWeatherWidget = () =>
  getClientConfig('showWeatherWidget', 'true') === 'true';

export const getShowNewsWidget = () =>
  getClientConfig('showNewsWidget', 'true') === 'true';

export const getMeasurementUnit = () => {
  const value =
    getClientConfig('measureUnit') ??
    getClientConfig('measurementUnit', 'metric');

  if (typeof value !== 'string') return 'metric';

  return value.toLowerCase();
};
