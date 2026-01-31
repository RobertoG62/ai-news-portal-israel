import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import newsData from '@/data/news.json';

export default function Home() {
  const breakingNews = newsData.news[0];
  const otherNews = newsData.news.slice(1);

  return (
    <div className="min-h-screen bg-cyber-gradient grid-pattern" dir="rtl">
      <Header />

      <main>
        {/* Hero Section */}
        <Hero
          headline={breakingNews.headline}
          title={breakingNews.title}
          summary={breakingNews.summary}
          source={breakingNews.source}
          timeAgo={breakingNews.timeAgo}
          category={breakingNews.category}
          isVerified={breakingNews.isVerified}
          sourceType={breakingNews.sourceType}
        />

        {/* Main Content Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-purple-500/40 to-transparent"></div>
            <h2 className="text-2xl font-bold">חדשות אחרונות</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* News Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherNews.map((article, index) => (
                <NewsCard
                  key={article.id}
                  title={article.title}
                  headline={article.headline}
                  summary={article.summary}
                  summaryBullets={article.summaryBullets}
                  category={article.category}
                  source={article.source}
                  sourceUrl={article.sourceUrl}
                  sourceType={article.sourceType}
                  sourceTypeHebrew={article.sourceTypeHebrew}
                  favicon={article.favicon}
                  timeAgo={article.timeAgo}
                  isBreaking={article.isBreaking}
                  isVerified={article.isVerified}
                  isHebrew={article.isHebrew}
                  featured={index === 0}
                />
              ))}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar tools={newsData.aiTools} />
            </div>
          </div>
        </section>

        {/* Sources Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              מקורות מידע פעילים
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <p className="text-purple-400 font-medium mb-2">רשמי</p>
                <ul className="space-y-1 text-gray-400">
                  {newsData.sources?.official?.map((s: string) => (
                    <li key={s} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-blue-400 font-medium mb-2">עברית</p>
                <ul className="space-y-1 text-gray-400">
                  {newsData.sources?.hebrew?.map((s: string) => (
                    <li key={s} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-purple-400 font-medium mb-2">טכנולוגיה</p>
                <ul className="space-y-1 text-gray-400">
                  {newsData.sources?.tech?.map((s: string) => (
                    <li key={s} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-cyan-400 font-medium mb-2">מחקר</p>
                <ul className="space-y-1 text-gray-400">
                  {newsData.sources?.research?.map((s: string) => (
                    <li key={s} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-cyan-500 rounded-full"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-orange-400 font-medium mb-2">קהילה</p>
                <ul className="space-y-1 text-gray-400">
                  {newsData.sources?.community?.map((s: string) => (
                    <li key={s} className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              עדכון אחרון: {newsData.lastUpdated ? new Date(newsData.lastUpdated).toLocaleString('he-IL') : 'לא זמין'}
            </p>
          </div>
        </section>

        {/* Market Overview Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold gradient-text mb-2">סקירת שוק ה-AI</h2>
              <p className="text-gray-400">שווי ותנועות שוק בזמן אמת</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* OpenAI Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">OpenAI</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">פרטית</span>
                </div>
                <div className="text-3xl font-bold text-green-400 mb-1">$750B</div>
                <div className="text-sm text-gray-400">שווי</div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="text-sm text-gray-400">הכנסות 2025</div>
                  <div className="text-lg font-semibold">$13B</div>
                </div>
              </div>

              {/* Anthropic Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">Anthropic</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400">פרטית</span>
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-1">$350B</div>
                <div className="text-sm text-gray-400">שווי</div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="text-sm text-gray-400">הכנסות 2025</div>
                  <div className="text-lg font-semibold">$10B</div>
                </div>
              </div>

              {/* NVIDIA Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">NVIDIA</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">NVDA</span>
                </div>
                <div className="text-3xl font-bold text-cyan-400 mb-1">$3.2T</div>
                <div className="text-sm text-gray-400">שווי שוק</div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                  <span className="text-sm text-gray-400">היום</span>
                  <span className="text-lg font-semibold text-green-400">+2.34%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
