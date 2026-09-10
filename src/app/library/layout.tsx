import { Metadata } from 'next';
import React from 'react';
import { translate } from '@/lib/i18n/translate';
import { getRequestLocale } from '@/lib/i18n/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getRequestLocale();

  return {
    title: translate(locale, 'meta.libraryTitle'),
  };
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default Layout;
