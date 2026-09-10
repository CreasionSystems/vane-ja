import { searchSearxng } from '@/lib/searxng';
import {
  getLanguageMeta,
  Locale,
  normalizeLocale,
} from '@/lib/i18n/languages';

type TopicSources = {
  query: string[];
  links: string[];
};

const websitesForTopic = {
  tech: {
    query: ['technology news', 'latest tech', 'AI', 'science and innovation'],
    links: ['techcrunch.com', 'wired.com', 'theverge.com'],
  },
  finance: {
    query: ['finance news', 'economy', 'stock market', 'investing'],
    links: ['bloomberg.com', 'cnbc.com', 'marketwatch.com'],
  },
  art: {
    query: ['art news', 'culture', 'modern art', 'cultural events'],
    links: ['artnews.com', 'hyperallergic.com', 'theartnewspaper.com'],
  },
  sports: {
    query: ['sports news', 'latest sports', 'cricket football tennis'],
    links: ['espn.com', 'bbc.com/sport', 'skysports.com'],
  },
  entertainment: {
    query: ['entertainment news', 'movies', 'TV shows', 'celebrities'],
    links: ['hollywoodreporter.com', 'variety.com', 'deadline.com'],
  },
};

type Topic = keyof typeof websitesForTopic;

/*
 * Discover is only useful if the sources themselves are in the reader's
 * language, so each locale gets its own outlets and its own query wording.
 */
const websitesForTopicByLocale: Record<Locale, Record<Topic, TopicSources>> = {
  en: websitesForTopic,
  ja: {
    tech: {
      query: [
        'テクノロジー ニュース',
        '最新ガジェット',
        'AI 最新',
        '科学 イノベーション',
      ],
      links: ['itmedia.co.jp', 'gizmodo.jp', 'ascii.jp'],
    },
    finance: {
      query: ['経済 ニュース', '株式市場', '為替 相場', '投資'],
      links: ['nikkei.com', 'toyokeizai.net', 'diamond.jp'],
    },
    art: {
      query: ['アート ニュース', '美術展', '現代アート', '文化 イベント'],
      links: ['bijutsutecho.com', 'tokyoartbeat.com', 'casabrutus.com'],
    },
    sports: {
      query: ['スポーツ ニュース', '野球 速報', 'サッカー 最新', 'テニス'],
      links: ['nikkansports.com', 'sponichi.co.jp', 'number.bunshun.jp'],
    },
    entertainment: {
      query: ['エンタメ ニュース', '映画 最新', 'ドラマ 話題', '音楽 ニュース'],
      links: ['natalie.mu', 'oricon.co.jp', 'eiga.com'],
    },
  },
};

export const GET = async (req: Request) => {
  try {
    const params = new URL(req.url).searchParams;

    const mode: 'normal' | 'preview' =
      (params.get('mode') as 'normal' | 'preview') || 'normal';
    const topic: Topic = (params.get('topic') as Topic) || 'tech';
    const locale = normalizeLocale(params.get('language'));
    const searchLanguage = getLanguageMeta(locale).searxngCode;

    const selectedTopic = websitesForTopicByLocale[locale][topic];

    let data = [];

    if (mode === 'normal') {
      const seenUrls = new Set();

      data = (
        await Promise.all(
          selectedTopic.links.flatMap((link) =>
            selectedTopic.query.map(async (query) => {
              return (
                await searchSearxng(`site:${link} ${query}`, {
                  engines: ['bing news'],
                  pageno: 1,
                  language: searchLanguage,
                })
              ).results;
            }),
          ),
        )
      )
        .flat()
        .filter((item) => {
          const url = item.url?.toLowerCase().trim();
          if (seenUrls.has(url)) return false;
          seenUrls.add(url);
          return true;
        })
        .sort(() => Math.random() - 0.5);
    } else {
      data = (
        await searchSearxng(
          `site:${selectedTopic.links[Math.floor(Math.random() * selectedTopic.links.length)]} ${selectedTopic.query[Math.floor(Math.random() * selectedTopic.query.length)]}`,
          {
            engines: ['bing news'],
            pageno: 1,
            language: searchLanguage,
          },
        )
      ).results;
    }

    return Response.json(
      {
        blogs: data,
      },
      {
        status: 200,
      },
    );
  } catch (err) {
    console.error(`An error occurred in discover route: ${err}`);
    return Response.json(
      {
        message: 'An error has occurred',
      },
      {
        status: 500,
      },
    );
  }
};
