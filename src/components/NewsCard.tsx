'use client';

import { useState } from 'react';
import { Clock, ExternalLink, Cpu, DollarSign, Boxes, LineChart, FlaskConical, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface NewsCardProps {
  title: string;
  headline: string;
  summary: string;
  summaryBullets?: string[];
  category: string;
  source: string;
  sourceUrl: string;
  timeAgo: string;
  isBreaking?: boolean;
  featured?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'מימון': <DollarSign className="w-4 h-4" />,
  'חומרה': <Cpu className="w-4 h-4" />,
  'מוצר': <Boxes className="w-4 h-4" />,
  'שווקים': <LineChart className="w-4 h-4" />,
  'מחקר': <FlaskConical className="w-4 h-4" />,
  Funding: <DollarSign className="w-4 h-4" />,
  Hardware: <Cpu className="w-4 h-4" />,
  Product: <Boxes className="w-4 h-4" />,
  Markets: <LineChart className="w-4 h-4" />,
  Research: <FlaskConical className="w-4 h-4" />,
};

export default function NewsCard({
  title,
  headline,
  summary,
  summaryBullets,
  category,
  source,
  sourceUrl,
  timeAgo,
  isBreaking,
  featured
}: NewsCardProps) {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <article
      className={`glass-card p-6 group cursor-pointer ${featured ? 'col-span-full lg:col-span-2' : ''}`}
    >
      {/* Category & Breaking Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white badge-${category}`}>
          {categoryIcons[category]}
          {category}
        </span>
        {isBreaking && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-xs text-red-400">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            מבזק
          </span>
        )}
      </div>

      {/* Content */}
      <h3 className={`font-bold mb-2 group-hover:text-violet-400 transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
        {title}
      </h3>

      <p className="text-sm text-violet-400/80 mb-3">{headline}</p>

      <p className={`text-gray-400 leading-relaxed mb-4 ${featured ? 'text-base' : 'text-sm line-clamp-3'}`}>
        {summary}
      </p>

      {/* Quick Summary Button */}
      {summaryBullets && summaryBullets.length > 0 && (
        <div className="mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSummary(!showSummary);
            }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-sm text-violet-300 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            סיכום מהיר
            {showSummary ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showSummary && (
            <div className="summary-panel mt-3 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-blue-500/5 border border-violet-500/20">
              <ul className="space-y-2">
                {summaryBullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 flex-shrink-0"></span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo}
          </span>
          <span className="text-gray-600">|</span>
          <span>{source}</span>
        </div>

        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          קרא עוד
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}
