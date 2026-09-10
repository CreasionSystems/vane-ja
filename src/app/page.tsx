import ChatWindow from '@/components/ChatWindow';
import { Metadata } from 'next';
import { translate } from '@/lib/i18n/translate';
import { getRequestLocale } from '@/lib/i18n/server';

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getRequestLocale();

  return {
    title: translate(locale, 'meta.chatTitle'),
    description: translate(locale, 'meta.chatDescription'),
  };
};

const Home = () => {
  return <ChatWindow />;
};

export default Home;
