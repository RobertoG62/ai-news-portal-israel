/**
 * Daily AI News Update Script
 *
 * Fetches AI-related news from multiple public sources:
 * 1. Hacker News API (free, no auth required)
 * 2. NewsAPI.org (optional, requires free API key)
 * 3. RSS feeds from tech sources
 *
 * Run manually: node scripts/update-news.js
 */

const fs = require('fs');
const path = require('path');

// Hebrew translations for categories
const categoryTranslations = {
  'funding': 'מימון',
  'hardware': 'חומרה',
  'product': 'מוצר',
  'markets': 'שווקים',
  'research': 'מחקר',
  'ai': 'מחקר',
  'startup': 'מימון',
  'launch': 'מוצר'
};

// Hebrew time ago translations
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

// Keywords to identify AI-related stories
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'neural', 'gpt',
  'openai', 'anthropic', 'claude', 'nvidia', 'llm', 'chatgpt', 'gemini',
  'deepmind', 'transformer', 'diffusion', 'stable diffusion', 'midjourney',
  'meta ai', 'microsoft copilot', 'github copilot', 'hugging face'
];

// Detect category from title/content
function detectCategory(title, content = '') {
  const text = (title + ' ' + content).toLowerCase();

  if (text.includes('funding') || text.includes('raises') || text.includes('investment') || text.includes('valuation') || text.includes('billion')) {
    return 'מימון';
  }
  if (text.includes('chip') || text.includes('gpu') || text.includes('hardware') || text.includes('nvidia') || text.includes('processor')) {
    return 'חומרה';
  }
  if (text.includes('launch') || text.includes('release') || text.includes('announce') || text.includes('new feature') || text.includes('update')) {
    return 'מוצר';
  }
  if (text.includes('stock') || text.includes('market') || text.includes('ipo') || text.includes('shares') || text.includes('trading')) {
    return 'שווקים';
  }
  return 'מחקר';
}

// Generate Hebrew summary bullets using simple extraction
function generateSummaryBullets(title, content) {
  // Simple extraction - in production, you'd use an LLM API
  const bullets = [
    `הכותרת: ${title.substring(0, 60)}...`,
    'פרטים נוספים זמינים בקישור המקורי',
    'עדכון אוטומטי מ-AI Pulse Israel'
  ];
  return bullets;
}

// Fetch top AI stories from Hacker News
async function fetchHackerNews() {
  console.log('📡 Fetching from Hacker News...');

  try {
    // Get top stories
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds = await topStoriesRes.json();

    const aiStories = [];

    // Check first 100 stories for AI-related content
    for (const id of topStoryIds.slice(0, 100)) {
      if (aiStories.length >= 5) break;

      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const story = await storyRes.json();

      if (!story || !story.title) continue;

      const titleLower = story.title.toLowerCase();
      const isAiRelated = AI_KEYWORDS.some(keyword => titleLower.includes(keyword));

      if (isAiRelated) {
        aiStories.push({
          id: story.id,
          title: story.title,
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
          score: story.score,
          time: new Date(story.time * 1000).toISOString(),
          source: 'Hacker News'
        });
      }
    }

    console.log(`✅ Found ${aiStories.length} AI stories from Hacker News`);
    return aiStories;
  } catch (error) {
    console.error('❌ Hacker News fetch failed:', error.message);
    return [];
  }
}

// Fetch from NewsAPI (optional - requires API key)
async function fetchNewsAPI() {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    console.log('⚠️ NEWS_API_KEY not set, skipping NewsAPI');
    return [];
  }

  console.log('📡 Fetching from NewsAPI...');

  try {
    const query = encodeURIComponent('artificial intelligence OR OpenAI OR Anthropic OR NVIDIA AI');
    const url = `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'ok') {
      console.error('❌ NewsAPI error:', data.message);
      return [];
    }

    const stories = data.articles.slice(0, 5).map((article, index) => ({
      id: Date.now() + index,
      title: article.title,
      description: article.description,
      url: article.url,
      time: article.publishedAt,
      source: article.source.name
    }));

    console.log(`✅ Found ${stories.length} stories from NewsAPI`);
    return stories;
  } catch (error) {
    console.error('❌ NewsAPI fetch failed:', error.message);
    return [];
  }
}

// Translate title to Hebrew using simple patterns (or LLM if API key available)
async function translateToHebrew(text) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a professional Hebrew translator specializing in tech news. Translate the following English tech news headline to Hebrew. Keep brand names in English. Return ONLY the Hebrew translation.'
            },
            {
              role: 'user',
              content: text
            }
          ],
          max_tokens: 200
        })
      });

      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Translation API error:', error.message);
    }
  }

  // Fallback: return original with Hebrew prefix
  return `🌐 ${text}`;
}

// Generate Hebrew headline
async function generateHeadline(title) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a Hebrew tech journalist. Create a catchy, professional Hebrew sub-headline (15-20 words) for this news story. Be engaging but professional. Return ONLY the Hebrew headline.'
            },
            {
              role: 'user',
              content: title
            }
          ],
          max_tokens: 100
        })
      });

      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Headline generation error:', error.message);
    }
  }

  return 'קראו את הפרטים המלאים בכתבה המקורית';
}

// Generate Hebrew summary
async function generateSummary(title, url) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a Hebrew tech journalist. Write a 2-3 sentence Hebrew summary for this AI news headline. Be informative and professional. Return ONLY the Hebrew summary.'
            },
            {
              role: 'user',
              content: title
            }
          ],
          max_tokens: 200
        })
      });

      const data = await res.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Summary generation error:', error.message);
    }
  }

  return `חדשות חמות מעולם הבינה המלאכותית. לפרטים המלאים, בקרו בקישור המקורי.`;
}

// Generate Hebrew bullet points
async function generateBullets(title) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a Hebrew tech journalist. Create exactly 3 bullet points in Hebrew summarizing the key points of this AI news headline. Each bullet should be 10-15 words. Return as JSON array of 3 strings.'
            },
            {
              role: 'user',
              content: title
            }
          ],
          max_tokens: 300
        })
      });

      const data = await res.json();
      const content = data.choices[0].message.content.trim();

      // Parse JSON array
      try {
        return JSON.parse(content);
      } catch {
        // If not valid JSON, split by newlines
        return content.split('\n').filter(line => line.trim()).slice(0, 3);
      }
    } catch (error) {
      console.error('Bullets generation error:', error.message);
    }
  }

  return [
    'עדכון חשוב מעולם הבינה המלאכותית',
    'השפעה צפויה על תעשיית הטכנולוגיה',
    'פרטים נוספים בקישור המקורי'
  ];
}

// Main update function
async function updateNews() {
  console.log('🚀 Starting daily news update...');
  console.log(`📅 ${new Date().toISOString()}\n`);

  // Fetch from all sources
  const [hackerNewsStories, newsApiStories] = await Promise.all([
    fetchHackerNews(),
    fetchNewsAPI()
  ]);

  // Combine and dedupe
  const allStories = [...hackerNewsStories, ...newsApiStories];

  if (allStories.length === 0) {
    console.log('❌ No stories found from any source');
    process.exit(1);
  }

  // Sort by recency and take top 5
  const topStories = allStories
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  console.log(`\n📰 Processing ${topStories.length} stories...\n`);

  // Transform to our format with Hebrew content
  const news = [];

  for (let i = 0; i < topStories.length; i++) {
    const story = topStories[i];
    console.log(`[${i + 1}/${topStories.length}] ${story.title.substring(0, 50)}...`);

    const [hebrewTitle, headline, summary, bullets] = await Promise.all([
      translateToHebrew(story.title),
      generateHeadline(story.title),
      generateSummary(story.title, story.url),
      generateBullets(story.title)
    ]);

    news.push({
      id: i + 1,
      title: hebrewTitle,
      headline: headline,
      summary: summary,
      summaryBullets: bullets,
      category: detectCategory(story.title, story.description || ''),
      source: story.source,
      sourceUrl: story.url,
      image: 'news',
      timeAgo: getHebrewTimeAgo(story.time),
      isBreaking: i === 0 // First story is breaking
    });
  }

  // Load existing data for AI tools (we keep those)
  const dataPath = path.join(__dirname, '../src/data/news.json');
  let existingData = { aiTools: [] };

  try {
    existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  } catch (error) {
    console.log('⚠️ Could not read existing data, creating fresh');
  }

  // Write updated data
  const updatedData = {
    news,
    aiTools: existingData.aiTools,
    lastUpdated: new Date().toISOString()
  };

  fs.writeFileSync(dataPath, JSON.stringify(updatedData, null, 2), 'utf-8');

  console.log(`\n✅ Successfully updated ${news.length} news stories!`);
  console.log(`📁 Written to: ${dataPath}`);
}

// Run
updateNews().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
