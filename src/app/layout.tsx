export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/theme/Provider';
import configManager from '@/lib/config';
import SetupWizard from '@/components/Setup/SetupWizard';
import { ChatProvider } from '@/lib/hooks/useChat';
import { I18nProvider } from '@/lib/i18n';
import { translate } from '@/lib/i18n/translate';
import { getLanguageMeta } from '@/lib/i18n/languages';
import { getRequestLocale } from '@/lib/i18n/server';

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  /* Montserrat has no CJK glyphs, so Japanese falls through to system faces */
  fallback: [
    'Hiragino Sans',
    'Hiragino Kaku Gothic ProN',
    'Yu Gothic',
    'Meiryo',
    'Noto Sans JP',
    'Arial',
    'sans-serif',
  ],
});

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getRequestLocale();

  return {
    title: translate(locale, 'meta.title'),
    description: translate(locale, 'meta.description'),
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setupComplete = configManager.isSetupComplete();
  const configSections = configManager.getUIConfigSections();
  const locale = await getRequestLocale();

  return (
    <html
      className="h-full"
      lang={getLanguageMeta(locale).htmlLang}
      suppressHydrationWarning
    >
      <body className={cn('h-full antialiased', montserrat.className)}>
        <I18nProvider initialLocale={locale}>
          <ThemeProvider>
            {setupComplete ? (
              <ChatProvider>
                <Sidebar>{children}</Sidebar>
                <Toaster
                  toastOptions={{
                    unstyled: true,
                    classNames: {
                      toast:
                        'bg-light-secondary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg p-4 flex flex-row items-center space-x-2',
                    },
                  }}
                />
              </ChatProvider>
            ) : (
              <SetupWizard configSections={configSections} />
            )}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
