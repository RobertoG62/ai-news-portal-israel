// ============================================================================
// AI NEWS FETCHER - Core logic for fetching and processing AI news
// ============================================================================

const SOURCE_CONFIG = {
  official: {
    type: 'official',
    typeHebrew: 'מקור רשמי',
    icon: 'verified',
    priority: 1,
    sources: [
      {
        name: 'OpenAI Blog',
        rssUrl: 'https://openai.com/blog/rss.xml',
        favicon: 'https://openai.com/favicon.ico',
      },
      {
        name: 'NVIDIA Newsroom',
        rssUrl: 'https://nvidianews.nvidia.com/rss.xml',
        favicon: 'https://www.nvidia.com/favicon.ico',
      }
    ]
  },
  hebrew: {
    type: 'local',
    typeHebrew: 'עדכון מקומי',
    icon: 'israel',
    priority: 2,
    sources: [
      {
        name: 'AI Israel Telegram',
        url: 'https://t.me/s/ai_tg_il',
        favicon: 'https://telegram.org/favicon.ico',
        isHebrew: true
      }
    ]
  },
  tech: {
    type: 'tech',
    typeHebrew: 'חדשות טכנולוגיה',
    icon: 'tech',
    priority: 3,
    sources: [
      {
        name: 'AI News',
        rssUrl: 'https://www.artificialintelligence-news.com/feed/',
        favicon: 'https://www.artificialintelligence-news.com/favicon.ico'
      }
    ]
  },
  community: {
    type: 'community',
    typeHebrew: 'קהילה',
    icon: 'community',
    priority: 5,
    sources: [
      {
        name: 'Hacker News',
        apiUrl: 'https://hacker-news.firebaseio.com/v0',
        favicon: 'https://news.ycombinator.com/favicon.ico'
      }
    ]
  }
};

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'neural', 'gpt',
  'openai', 'anthropic', 'claude', 'nvidia', 'llm', 'chatgpt', 'gemini',
  'deepmind', 'transformer', 'diffusion', 'midjourney', 'hugging face',
  'meta ai', 'copilot', 'llama', 'mistral', 'groq', 'perplexity'
];

const BRAND_NAMES = [
  'OpenAI', 'Anthropic', 'NVIDIA', 'Google', 'Microsoft', 'Meta', 'Apple',
  'Claude', 'GPT', 'ChatGPT', 'Gemini', 'Copilot', 'Llama', 'Mistral',
  'DeepMind', 'Hugging Face', 'TensorFlow', 'PyTorch', 'CUDA',
  'GeForce', 'RTX', 'DGX', 'Omniverse', 'DALL-E', 'Sora', 'Midjourney',
  'Perplexity', 'Groq', 'xAI', 'Grok', 'AWS', 'Azure', 'Stability AI'
];

// ============================================================================
// Types
// ============================================================================

interface Story {
  id: string;
  title: string;
  url: string;
  time: string;
  source: string;
  sourceType: string;
  sourceTypeHebrew: string;
  sourceIcon: string;
  favicon: string;
  isHebrew: boolean;
  isVerified: boolean;
  description?: string;
  score?: number;
  originalTitle?: string;
  headline?: string;
  summary?: string;
  summaryBullets?: string[];
  category?: string;
}

export interface NewsItem {
  id: number;
  title: string;
  originalTitle?: string;
  headline: string;
  summary: string;
  summaryBullets: string[];
  category: string;
  source: string;
  sourceUrl: string;
  sourceType: string;
  sourceTypeHebrew: string;
  sourceIcon: string;
  favicon: string;
  timeAgo: string;
  isBreaking: boolean;
  isVerified: boolean;
  isHebrew: boolean;
}

export interface AiTool {
  name: string;
  company: string;
  description: string;
  trending: boolean;
  category: string;
}

export interface NewsData {
  news: NewsItem[];
  aiTools: AiTool[];
  lastUpdated: string;
  sources: {
    official: string[];
    hebrew: string[];
    tech: string[];
    community: string[];
    research?: string[];
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

function getHebrewTimeAgo(date: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'לפני פחות משעה';
  if (diffHours === 1) return 'לפני שעה';
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return 'לפני יום';
  return `לפני ${diffDays} ימים`;
}

function detectCategory(title: string, content: string = ''): string {
  const text = (title + ' ' + content).toLowerCase();

  if (text.includes('funding') || text.includes('raises') || text.includes('investment') || text.includes('valuation') || text.includes('billion') || text.includes('million')) {
    return 'מימון';
  }
  if (text.includes('chip') || text.includes('gpu') || text.includes('hardware') || text.includes('processor') || text.includes('server')) {
    return 'חומרה';
  }
  if (text.includes('launch') || text.includes('release') || text.includes('announce') || text.includes('new feature') || text.includes('update') || text.includes('available')) {
    return 'מוצר';
  }
  if (text.includes('stock') || text.includes('market') || text.includes('ipo') || text.includes('shares') || text.includes('trading')) {
    return 'שווקים';
  }
  return 'מחקר';
}

function isAiRelated(text: string): boolean {
  const lowerText = text.toLowerCase();
  return AI_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// Fetchers
// ============================================================================

async function fetchHackerNews(): Promise<Story[]> {
  try {
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      cache: 'no-store'
    });
    const topStoryIds = await topStoriesRes.json();

    const stories: Story[] = [];

    for (const id of topStoryIds.slice(0, 80)) {
      if (stories.length >= 3) break;

      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        cache: 'no-store'
      });
      const story = await storyRes.json();

      if (!story || !story.title) continue;

      if (isAiRelated(story.title)) {
        stories.push({
          id: `hn-${story.id}`,
          title: story.title,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          time: new Date(story.time * 1000).toISOString(),
          source: 'Hacker News',
          sourceType: 'community',
          sourceTypeHebrew: 'קהילה',
          sourceIcon: 'community',
          favicon: 'https://news.ycombinator.com/favicon.ico',
          isHebrew: false,
          isVerified: false,
          score: story.score
        });
      }
    }

    return stories;
  } catch (error) {
    console.error('Hacker News fetch failed:', error);
    return [];
  }
}

async function fetchTelegram(channelUrl: string): Promise<Story[]> {
  try {
    const res = await fetch(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      cache: 'no-store'
    });
    const html = await res.text();

    const messages: Story[] = [];
    let count = 0;

    const textMatches = html.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>[\s\S]*?<\/div>/g) || [];

    for (const textMatch of textMatches.slice(0, 5)) {
      const cleanText = textMatch
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 300);

      if (cleanText.length > 20) {
        messages.push({
          id: `tg-${Date.now()}-${count++}`,
          title: cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : ''),
          url: channelUrl,
          time: new Date().toISOString(),
          source: 'AI Israel Telegram',
          sourceType: 'local',
          sourceTypeHebrew: 'עדכון מקומי',
          sourceIcon: 'israel',
          favicon: 'https://telegram.org/favicon.ico',
          isHebrew: true,
          isVerified: false
        });
      }
    }

    return messages.slice(0, 2);
  } catch (error) {
    console.error('Telegram fetch failed:', error);
    return [];
  }
}

async function fetchRSS(source: { name: string; rssUrl?: string; favicon: string }, sourceConfig: { type: string; typeHebrew: string; icon: string }): Promise<Story[]> {
  if (!source.rssUrl) return [];

  try {
    const res = await fetch(source.rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Pulse-Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      },
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const items: Story[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 3) {
      const itemXml = match[1];

      const titleMatch = itemXml.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
      const linkMatch = itemXml.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const descMatch = itemXml.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);

      if (titleMatch && linkMatch) {
        const title = titleMatch[1].trim().replace(/<[^>]+>/g, '');
        const link = linkMatch[1].trim();
        const description = descMatch ? descMatch[1].trim().replace(/<[^>]+>/g, '').substring(0, 200) : '';

        if (sourceConfig.type === 'official' || isAiRelated(title + ' ' + description)) {
          items.push({
            id: `rss-${source.name.toLowerCase().replace(/\s+/g, '-')}-${items.length}`,
            title,
            description,
            url: link,
            time: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
            source: source.name,
            sourceType: sourceConfig.type,
            sourceTypeHebrew: sourceConfig.typeHebrew,
            sourceIcon: sourceConfig.icon,
            favicon: source.favicon,
            isHebrew: false,
            isVerified: sourceConfig.type === 'official'
          });
        }
      }
    }

    return items;
  } catch (error) {
    console.error(`RSS fetch failed for ${source.name}:`, error);
    return [];
  }
}

// ============================================================================
// Translation (MyMemory API - FREE)
// ============================================================================

async function translateToHebrew(text: string): Promise<string | null> {
  if (!text || text.length < 3) return null;

  let processedText = text;
  const replacements: { placeholder: string; brand: string }[] = [];

  BRAND_NAMES.forEach((brand, index) => {
    const regex = new RegExp(`\\b${brand}\\b`, 'gi');
    if (processedText.match(regex)) {
      const placeholder = `XBRAND${index}X`;
      processedText = processedText.replace(regex, placeholder);
      replacements.push({ placeholder, brand });
    }
  });

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(processedText)}&langpair=en|he`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
      return null;
    }

    let translated = data.responseData.translatedText;

    replacements.forEach(({ placeholder, brand }) => {
      const placeholderRegex = new RegExp(`\\s*${placeholder}\\s*`, 'gi');
      translated = translated.replace(placeholderRegex, ` ${brand} `);
    });

    translated = translated.replace(/\s+/g, ' ').trim();

    return translated;
  } catch (error) {
    console.error('Translation error:', error);
    return null;
  }
}

function generateHebrewHeadline(category: string): string {
  const headlines: Record<string, string[]> = {
    'מוצר': ['השקה חדשה שתשנה את התעשייה', 'מוצר חדש מבטיח לחולל מהפכה', 'עדכון משמעותי שכדאי להכיר'],
    'מימון': ['השקעה ענקית מעידה על פוטנציאל', 'גיוס הון משמעותי בתעשיית ה-AI', 'משקיעים מאמינים בטכנולוגיה'],
    'חומרה': ['חומרה חדשה תאיץ את עולם ה-AI', 'שבב חדש מבטיח ביצועים מרשימים', 'פריצת דרך בתחום החומרה'],
    'מחקר': ['מחקר חדש חושף תובנות מרתקות', 'התקדמות משמעותית בתחום', 'פיתוח חדש פותח אפשרויות'],
    'שווקים': ['תזוזות בשוק ה-AI', 'השפעה על שוק ההון', 'מגמות חדשות בשוק']
  };

  const categoryHeadlines = headlines[category] || headlines['מחקר'];
  return categoryHeadlines[Math.floor(Math.random() * categoryHeadlines.length)];
}

function generateSummaryBullets(sourceType: string): string[] {
  const bullets: Record<string, string[]> = {
    official: ['הודעה רשמית מחברת הטכנולוגיה המובילה', 'צפי להשפעה משמעותית על השוק', 'פרטים מלאים בקישור המקורי'],
    tech: ['סיקור מקיף מאתר טכנולוגיה מוביל', 'ניתוח השלכות על התעשייה', 'המשך מעקב אחר ההתפתחויות'],
    research: ['מחקר חדש בתחום הבינה המלאכותית', 'תרומה לקידום הידע בתחום', 'פוטנציאל ליישומים עתידיים'],
    community: ['נושא שמסעיר את קהילת הטכנולוגיה', 'דיון ער בקרב מפתחים ומומחים', 'שווה לעקוב אחר התגובות'],
    local: ['עדכון חדש מקהילת ה-AI הישראלית', 'מידע רלוונטי לשוק המקומי', 'לפרטים נוספים בקישור המקורי']
  };

  return bullets[sourceType] || bullets.tech;
}

async function processStory(story: Story): Promise<Story> {
  const category = detectCategory(story.title, story.description || '');

  if (story.isHebrew) {
    return {
      ...story,
      headline: 'עדכון מקומי מקהילת AI בישראל',
      summary: story.title,
      summaryBullets: generateSummaryBullets('local'),
      category
    };
  }

  const hebrewTitle = await translateToHebrew(story.title);
  const headline = generateHebrewHeadline(category);
  const summaryBullets = generateSummaryBullets(story.sourceType);

  let summary: string;
  if (hebrewTitle) {
    summary = `${hebrewTitle}. ${headline}`;
  } else {
    summary = 'חדשות חמות מעולם הבינה המלאכותית. לפרטים המלאים, בקרו בקישור המקורי.';
  }

  return {
    ...story,
    title: hebrewTitle || story.title,
    originalTitle: story.title,
    headline,
    summary,
    summaryBullets,
    category
  };
}

// ============================================================================
// Main Fetch Function
// ============================================================================

export async function fetchAllNews(): Promise<NewsData | null> {
  console.log('Fetching fresh news...');

  const allStories: Story[] = [];

  // 1. Fetch from OFFICIAL sources
  for (const source of SOURCE_CONFIG.official.sources) {
    const stories = await fetchRSS(source, SOURCE_CONFIG.official);
    allStories.push(...stories);
    await sleep(200);
  }

  // 2. Fetch from HEBREW sources
  const telegramStories = await fetchTelegram('https://t.me/s/ai_tg_il');
  allStories.push(...telegramStories);
  await sleep(200);

  // 3. Fetch from TECH sources
  for (const source of SOURCE_CONFIG.tech.sources) {
    const stories = await fetchRSS(source, SOURCE_CONFIG.tech);
    allStories.push(...stories);
    await sleep(200);
  }

  // 4. Fetch from COMMUNITY sources
  const hnStories = await fetchHackerNews();
  allStories.push(...hnStories);

  console.log(`Total stories collected: ${allStories.length}`);

  if (allStories.length === 0) {
    return null;
  }

  // Sort by priority and time
  const priorityOrder: Record<string, number> = { official: 1, local: 2, tech: 3, research: 4, community: 5 };
  const sortedStories = allStories
    .sort((a, b) => {
      const priorityDiff = (priorityOrder[a.sourceType] || 99) - (priorityOrder[b.sourceType] || 99);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    })
    .slice(0, 10);

  // Process stories with translation
  const processedNews: NewsItem[] = [];
  for (let i = 0; i < sortedStories.length; i++) {
    const processed = await processStory(sortedStories[i]);
    processedNews.push({
      id: i + 1,
      title: processed.title,
      originalTitle: processed.originalTitle,
      headline: processed.headline || '',
      summary: processed.summary || '',
      summaryBullets: processed.summaryBullets || [],
      category: processed.category || 'מחקר',
      source: processed.source,
      sourceUrl: processed.url,
      sourceType: processed.sourceType,
      sourceTypeHebrew: processed.sourceTypeHebrew,
      sourceIcon: processed.sourceIcon,
      favicon: processed.favicon,
      timeAgo: getHebrewTimeAgo(processed.time),
      isBreaking: i === 0,
      isVerified: processed.isVerified,
      isHebrew: processed.isHebrew
    });
    await sleep(150);
  }

  const aiTools: AiTool[] = [
    { name: 'Claude Code', company: 'Anthropic', description: 'סוכן קידוד AI מבוסס טרמינל', trending: true, category: 'קידוד' },
    { name: 'GPT-5.2', company: 'OpenAI', description: 'מודל חשיבה מתקדם', trending: true, category: 'LLM' },
    { name: 'Gemini 3 Pro', company: 'Google', description: 'מוביל בדירוג העדפות משתמשים', trending: true, category: 'LLM' },
    { name: 'Vera Rubin', company: 'NVIDIA', description: 'פלטפורמת מחשוב AI מהדור הבא', trending: false, category: 'חומרה' },
    { name: 'Synthesia', company: 'Synthesia', description: 'פלטפורמת יצירת וידאו AI', trending: false, category: 'וידאו' }
  ];

  return {
    news: processedNews,
    aiTools,
    lastUpdated: new Date().toISOString(),
    sources: {
      official: SOURCE_CONFIG.official.sources.map(s => s.name),
      hebrew: SOURCE_CONFIG.hebrew.sources.map(s => s.name),
      tech: SOURCE_CONFIG.tech.sources.map(s => s.name),
      community: SOURCE_CONFIG.community.sources.map(s => s.name)
    }
  };
}
