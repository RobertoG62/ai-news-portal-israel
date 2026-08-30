// Source icons are served from this site. They used to be fetched from each
// publisher on every card render, so reading the front page told OpenAI,
// NVIDIA and the rest that you were reading it. Three could not be
// downloaded and are blank; the card falls back to its own mark.
/**
 * Multi-Source AI News Fetcher
 *
 * Fetches AI news from diverse sources:
 * - OFFICIAL: OpenAI, Anthropic, NVIDIA blogs
 * - HEBREW: Telegram AI Israel, il.chat
 * - TECH: TechCrunch, AI News
 * - RESEARCH: HuggingFace, arXiv
 * - COMMUNITY: Hacker News
 *
 * Run manually: node scripts/update-news.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// SOURCE CONFIGURATION
// ============================================================================

const SOURCE_CONFIG = {
  // Official company blogs (highest priority)
  official: {
    type: 'official',
    typeHebrew: 'מקור רשמי',
    icon: 'verified',
    priority: 1,
    sources: [
      {
        name: 'OpenAI Blog',
        url: 'https://openai.com/blog',
        rssUrl: 'https://openai.com/blog/rss.xml',
        favicon: '/favicons/openai-com.ico',
        keywords: ['openai', 'gpt', 'chatgpt', 'dall-e', 'sora']
      },
      {
        name: 'Anthropic News',
        url: 'https://www.anthropic.com/news',
        rssUrl: 'https://www.anthropic.com/rss.xml',
        favicon: '/favicons/anthropic-com.ico',
        keywords: ['anthropic', 'claude', 'constitutional ai']
      },
      {
        name: 'NVIDIA Newsroom',
        url: 'https://nvidianews.nvidia.com',
        rssUrl: 'https://nvidianews.nvidia.com/rss.xml',
        favicon: '/favicons/nvidia-com.ico',
        keywords: ['nvidia', 'gpu', 'cuda', 'tensorrt', 'dgx']
      }
    ]
  },

  // Hebrew/Israeli sources (no translation needed)
  hebrew: {
    type: 'local',
    typeHebrew: 'עדכון מקומי',
    icon: 'israel',
    priority: 2,
    sources: [
      {
        name: 'AI Israel Telegram',
        url: 'https://t.me/s/ai_tg_il',
        favicon: '/favicons/telegram-org.ico',
        isHebrew: true
      },
      {
        name: 'il.chat',
        url: 'https://il.chat',
        favicon: '',
        isHebrew: true
      }
    ]
  },

  // Tech news sites
  tech: {
    type: 'tech',
    typeHebrew: 'חדשות טכנולוגיה',
    icon: 'tech',
    priority: 3,
    sources: [
      {
        name: 'TechCrunch AI',
        url: 'https://techcrunch.com/tag/artificial-intelligence/',
        rssUrl: 'https://techcrunch.com/tag/artificial-intelligence/feed/',
        favicon: '/favicons/techcrunch-com.ico'
      },
      {
        name: 'AI News',
        url: 'https://www.artificialintelligence-news.com',
        rssUrl: 'https://www.artificialintelligence-news.com/feed/',
        favicon: ''
      }
    ]
  },

  // Research sources
  research: {
    type: 'research',
    typeHebrew: 'מחקר',
    icon: 'research',
    priority: 4,
    sources: [
      {
        name: 'Hugging Face Blog',
        url: 'https://huggingface.co/blog',
        rssUrl: 'https://huggingface.co/blog/feed.xml',
        favicon: '/favicons/huggingface-co.ico'
      },
      {
        name: 'arXiv AI',
        url: 'https://arxiv.org/list/cs.AI/recent',
        rssUrl: 'https://rss.arxiv.org/rss/cs.AI',
        favicon: ''
      }
    ]
  },

  // Community sources
  community: {
    type: 'community',
    typeHebrew: 'קהילה',
    icon: 'community',
    priority: 5,
    sources: [
      {
        name: 'Hacker News',
        url: 'https://news.ycombinator.com',
        apiUrl: 'https://hacker-news.firebaseio.com/v0',
        favicon: '/favicons/news-ycombinator-com.ico'
      }
    ]
  }
};

// AI-related keywords for filtering
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'neural', 'gpt',
  'openai', 'anthropic', 'claude', 'nvidia', 'llm', 'chatgpt', 'gemini',
  'deepmind', 'transformer', 'diffusion', 'midjourney', 'hugging face',
  'meta ai', 'copilot', 'llama', 'mistral', 'groq', 'perplexity'
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getHebrewTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'לפני פחות משעה';
  if (diffHours === 1) return 'לפני שעה';
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays === 1) return 'לפני יום';
  return `לפני ${diffDays} ימים`;
}

function detectCategory(title, content = '') {
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

function isAiRelated(text) {
  const lowerText = text.toLowerCase();
  return AI_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// SOURCE FETCHERS
// ============================================================================

/**
 * Fetch from Hacker News API
 */
async function fetchHackerNews() {
  console.log('  📡 Hacker News...');

  try {
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds = await topStoriesRes.json();

    const stories = [];

    for (const id of topStoryIds.slice(0, 80)) {
      if (stories.length >= 3) break;

      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
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
          favicon: '/favicons/news-ycombinator-com.ico',
          isHebrew: false,
          isVerified: false,
          score: story.score
        });
      }
    }

    console.log(`    ✓ ${stories.length} stories`);
    return stories;
  } catch (error) {
    console.error(`    ✗ Failed: ${error.message}`);
    return [];
  }
}

/**
 * Fetch from Telegram public preview
 */
async function fetchTelegram(channelUrl) {
  console.log(`  📡 Telegram (${channelUrl})...`);

  try {
    const res = await fetch(channelUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();

    // Extract messages from Telegram preview HTML
    const messageRegex = /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g;
    const dateRegex = /<time[^>]*datetime="([^"]+)"[^>]*>/g;
    const linkRegex = /<a[^>]*href="(https:\/\/t\.me\/[^"]+)"[^>]*>/g;

    const messages = [];
    let match;
    let count = 0;

    // Simple extraction of recent posts
    const textMatches = html.match(/<div class="tgme_widget_message_text[^"]*"[^>]*>[\s\S]*?<\/div>/g) || [];

    for (const textMatch of textMatches.slice(0, 5)) {
      // Clean HTML tags
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
          favicon: '/favicons/telegram-org.ico',
          isHebrew: true,
          isVerified: false
        });
      }
    }

    console.log(`    ✓ ${messages.length} messages`);
    return messages.slice(0, 2);
  } catch (error) {
    console.error(`    ✗ Failed: ${error.message}`);
    return [];
  }
}

/**
 * Fetch from RSS feed
 */
async function fetchRSS(source, sourceConfig) {
  console.log(`  📡 ${source.name}...`);

  if (!source.rssUrl) {
    console.log(`    ⚠ No RSS URL configured`);
    return [];
  }

  try {
    const res = await fetch(source.rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-Pulse-Bot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const xml = await res.text();

    // Simple RSS parsing
    const items = [];
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

        // Filter for AI content if not an official source
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

    console.log(`    ✓ ${items.length} items`);
    return items;
  } catch (error) {
    console.error(`    ✗ Failed: ${error.message}`);
    return [];
  }
}

/**
 * Scrape website for news (fallback)
 */
async function scrapeWebsite(source, sourceConfig) {
  console.log(`  📡 ${source.name} (scraping)...`);

  try {
    const res = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();

    const items = [];

    // Extract article titles and links
    const articleRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:AI|GPT|Claude|Anthropic|NVIDIA|Machine Learning)[^<]*)<\/a>/gi;
    let match;

    while ((match = articleRegex.exec(html)) !== null && items.length < 2) {
      const [, url, title] = match;
      const cleanTitle = title.trim();

      if (cleanTitle.length > 15 && cleanTitle.length < 200) {
        items.push({
          id: `scrape-${source.name.toLowerCase().replace(/\s+/g, '-')}-${items.length}`,
          title: cleanTitle,
          url: url.startsWith('http') ? url : new URL(url, source.url).href,
          time: new Date().toISOString(),
          source: source.name,
          sourceType: sourceConfig.type,
          sourceTypeHebrew: sourceConfig.typeHebrew,
          sourceIcon: sourceConfig.icon,
          favicon: source.favicon,
          isHebrew: source.isHebrew || false,
          isVerified: sourceConfig.type === 'official'
        });
      }
    }

    console.log(`    ✓ ${items.length} items`);
    return items;
  } catch (error) {
    console.error(`    ✗ Failed: ${error.message}`);
    return [];
  }
}

// ============================================================================
// FREE TRANSLATION (MyMemory API - no key required)
// ============================================================================

// Brand names to preserve in English during translation
const BRAND_NAMES = [
  'OpenAI', 'Anthropic', 'NVIDIA', 'Google', 'Microsoft', 'Meta', 'Apple',
  'Claude', 'GPT', 'ChatGPT', 'Gemini', 'Copilot', 'Llama', 'Mistral',
  'DeepMind', 'Hugging Face', 'TensorFlow', 'PyTorch', 'CUDA',
  'GeForce', 'RTX', 'DGX', 'Omniverse', 'DALL-E', 'Sora', 'Midjourney',
  'Perplexity', 'Groq', 'xAI', 'Grok', 'AWS', 'Azure', 'Stability AI'
];

/**
 * Translate text to Hebrew using MyMemory API (FREE, no key needed)
 * Limit: 5000 chars/day for anonymous, 50000/day with email
 */
async function translateToHebrew(text) {
  if (!text || text.length < 3) return null;

  // Preserve brand names by replacing them with placeholders
  let processedText = text;
  const replacements = [];

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
    const res = await fetch(url);
    const data = await res.json();

    if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
      return null;
    }

    let translated = data.responseData.translatedText;

    // Restore brand names - handle various spacing/formatting the API might add
    replacements.forEach(({ placeholder, brand }) => {
      // Match placeholder with possible spaces around it
      const placeholderRegex = new RegExp(`\\s*${placeholder}\\s*`, 'gi');
      translated = translated.replace(placeholderRegex, ` ${brand} `);
    });

    // Clean up double spaces
    translated = translated.replace(/\s+/g, ' ').trim();

    return translated;
  } catch (error) {
    console.error(`    Translation error: ${error.message}`);
    return null;
  }
}

/**
 * Generate Hebrew headline based on category
 */
function generateHebrewHeadline(title, category) {
  const headlines = {
    'מוצר': [
      'השקה חדשה שתשנה את התעשייה',
      'מוצר חדש מבטיח לחולל מהפכה',
      'עדכון משמעותי שכדאי להכיר'
    ],
    'מימון': [
      'השקעה ענקית מעידה על פוטנציאל',
      'גיוס הון משמעותי בתעשיית ה-AI',
      'משקיעים מאמינים בטכנולוגיה'
    ],
    'חומרה': [
      'חומרה חדשה תאיץ את עולם ה-AI',
      'שבב חדש מבטיח ביצועים מרשימים',
      'פריצת דרך בתחום החומרה'
    ],
    'מחקר': [
      'מחקר חדש חושף תובנות מרתקות',
      'התקדמות משמעותית בתחום',
      'פיתוח חדש פותח אפשרויות'
    ],
    'שווקים': [
      'תזוזות בשוק ה-AI',
      'השפעה על שוק ההון',
      'מגמות חדשות בשוק'
    ]
  };

  const categoryHeadlines = headlines[category] || headlines['מחקר'];
  return categoryHeadlines[Math.floor(Math.random() * categoryHeadlines.length)];
}

/**
 * Generate summary bullets based on source type
 */
function generateSummaryBullets(sourceType, category) {
  const bullets = {
    official: [
      'הודעה רשמית מחברת הטכנולוגיה המובילה',
      'צפי להשפעה משמעותית על השוק',
      'פרטים מלאים בקישור המקורי'
    ],
    tech: [
      'סיקור מקיף מאתר טכנולוגיה מוביל',
      'ניתוח השלכות על התעשייה',
      'המשך מעקב אחר ההתפתחויות'
    ],
    research: [
      'מחקר חדש בתחום הבינה המלאכותית',
      'תרומה לקידום הידע בתחום',
      'פוטנציאל ליישומים עתידיים'
    ],
    community: [
      'נושא שמסעיר את קהילת הטכנולוגיה',
      'דיון ער בקרב מפתחים ומומחים',
      'שווה לעקוב אחר התגובות'
    ],
    local: [
      'עדכון חדש מקהילת ה-AI הישראלית',
      'מידע רלוונטי לשוק המקומי',
      'לפרטים נוספים בקישור המקורי'
    ]
  };

  return bullets[sourceType] || bullets.tech;
}

async function processStory(story, index) {
  console.log(`  [${index + 1}] ${story.title.substring(0, 50)}...`);

  const category = detectCategory(story.title, story.description || '');

  // If already Hebrew, keep original
  if (story.isHebrew) {
    return {
      ...story,
      headline: 'עדכון מקומי מקהילת AI בישראל',
      summary: story.title,
      summaryBullets: generateSummaryBullets('local', category),
      category
    };
  }

  // Translate title to Hebrew using FREE MyMemory API
  const hebrewTitle = await translateToHebrew(story.title);

  // Generate contextual Hebrew content
  const headline = generateHebrewHeadline(story.title, category);
  const summaryBullets = generateSummaryBullets(story.sourceType, category);

  // Create Hebrew summary from translated title or generate one
  let summary;
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
// MAIN UPDATE FUNCTION
// ============================================================================

async function updateNews() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🌐 AI Pulse Israel - Multi-Source News Fetcher              ║
║  📅 ${new Date().toISOString().padEnd(54)}║
╚══════════════════════════════════════════════════════════════╝
`);

  const allStories = [];

  // 1. Fetch from OFFICIAL sources
  console.log('\n📌 OFFICIAL SOURCES (מקור רשמי):');
  for (const source of SOURCE_CONFIG.official.sources) {
    const stories = await fetchRSS(source, SOURCE_CONFIG.official);
    allStories.push(...stories);
    await sleep(500);
  }

  // 2. Fetch from HEBREW sources
  console.log('\n🇮🇱 HEBREW SOURCES (עדכון מקומי):');
  const telegramStories = await fetchTelegram('https://t.me/s/ai_tg_il');
  allStories.push(...telegramStories);
  await sleep(500);

  // 3. Fetch from TECH sources
  console.log('\n💻 TECH SOURCES (חדשות טכנולוגיה):');
  for (const source of SOURCE_CONFIG.tech.sources) {
    const stories = await fetchRSS(source, SOURCE_CONFIG.tech);
    allStories.push(...stories);
    await sleep(500);
  }

  // 4. Fetch from RESEARCH sources
  console.log('\n🔬 RESEARCH SOURCES (מחקר):');
  for (const source of SOURCE_CONFIG.research.sources) {
    const stories = await fetchRSS(source, SOURCE_CONFIG.research);
    allStories.push(...stories);
    await sleep(500);
  }

  // 5. Fetch from COMMUNITY sources
  console.log('\n👥 COMMUNITY SOURCES (קהילה):');
  const hnStories = await fetchHackerNews();
  allStories.push(...hnStories);

  console.log(`\n📊 Total stories collected: ${allStories.length}`);

  if (allStories.length === 0) {
    console.log('❌ No stories found from any source');
    process.exit(1);
  }

  // Sort by priority and time
  const priorityOrder = { official: 1, local: 2, tech: 3, research: 4, community: 5 };
  const sortedStories = allStories
    .sort((a, b) => {
      // First by priority
      const priorityDiff = (priorityOrder[a.sourceType] || 99) - (priorityOrder[b.sourceType] || 99);
      if (priorityDiff !== 0) return priorityDiff;
      // Then by time
      return new Date(b.time) - new Date(a.time);
    })
    .slice(0, 10); // Top 10 stories

  console.log(`\n🔄 Processing top ${sortedStories.length} stories...\n`);

  // Process stories with translation
  const processedNews = [];
  for (let i = 0; i < sortedStories.length; i++) {
    const processed = await processStory(sortedStories[i], i);
    processedNews.push({
      id: i + 1,
      title: processed.title,
      originalTitle: processed.originalTitle,
      headline: processed.headline,
      summary: processed.summary,
      summaryBullets: processed.summaryBullets,
      category: processed.category,
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
    await sleep(300);
  }

  // Load existing data
  const dataPath = path.join(__dirname, '../src/data/news.json');
  let existingData = { aiTools: [] };

  try {
    existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (error) {
    console.log('⚠️ Could not read existing data, creating fresh');
  }

  // Write updated data
  const updatedData = {
    news: processedNews,
    aiTools: existingData.aiTools,
    lastUpdated: new Date().toISOString(),
    sources: {
      official: SOURCE_CONFIG.official.sources.map(s => s.name),
      hebrew: SOURCE_CONFIG.hebrew.sources.map(s => s.name),
      tech: SOURCE_CONFIG.tech.sources.map(s => s.name),
      research: SOURCE_CONFIG.research.sources.map(s => s.name),
      community: SOURCE_CONFIG.community.sources.map(s => s.name)
    }
  };

  fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2), 'utf-8');

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  ✅ Update Complete!                                         ║
╠══════════════════════════════════════════════════════════════╣
║  📰 Stories: ${String(processedNews.length).padEnd(47)}║
║  🔍 Official: ${String(processedNews.filter(n => n.sourceType === 'official').length).padEnd(46)}║
║  🇮🇱 Hebrew: ${String(processedNews.filter(n => n.isHebrew).length).padEnd(48)}║
║  🔬 Research: ${String(processedNews.filter(n => n.sourceType === 'research').length).padEnd(46)}║
║  📁 Path: ${dataPath.substring(0, 50).padEnd(50)}║
╚══════════════════════════════════════════════════════════════╝
`);
}

// Run
updateNews().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
