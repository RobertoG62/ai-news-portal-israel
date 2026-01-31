'use client';

import { TrendingUp, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  headline: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  category: string;
  isVerified?: boolean;
  sourceType?: string;
}

export default function Hero({ headline, title, summary, source, timeAgo, category, isVerified, sourceType }: HeroProps) {
  return (
    <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects - More subtle */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-40 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/2 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 breaking-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-red-400">מבזק</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-sm text-purple-300">
            <TrendingUp className="w-3.5 h-3.5" />
            פופולרי
          </span>

          {isVerified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full verified-badge text-sm text-white font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              מקור רשמי מאומת
            </span>
          )}

          {sourceType === 'official' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/25 text-sm text-green-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              מקור רשמי
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl">
          <p className="text-purple-400 text-lg font-medium mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {headline}
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="gradient-text glow-text">{title}</span>
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
            {summary}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className={`px-3 py-1 rounded-full text-white badge-${category}`}>
              {category}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {timeAgo}
            </span>
            <span>מקור: <span className="text-purple-400 font-medium">{source}</span></span>
          </div>
        </div>

        {/* Decorative Elements - More subtle */}
        <div className="absolute top-1/2 left-0 hidden xl:block">
          <div className="relative">
            <div className="w-64 h-64 rounded-3xl animated-border p-6 opacity-50">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-500/15 to-blue-500/15"></div>
            </div>
            <div className="absolute -top-4 -right-4 w-48 h-48 rounded-3xl animated-border p-4 opacity-30">
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
