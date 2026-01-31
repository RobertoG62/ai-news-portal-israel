'use client';

import { useState } from 'react';
import {
  Clock, ExternalLink, Cpu, DollarSign, Boxes, LineChart, FlaskConical,
  Sparkles, ChevronDown, ChevronUp, CheckCircle2, Globe, Flag, Users, BookOpen
} from 'lucide-react';
import Image from 'next/image';

interface NewsCardProps {
  title: string;
  headline: string;
  summary: string;
  summaryBullets?: string[];
  category: string;
  source: string;
  sourceUrl: string;
  sourceType?: string;
  sourceTypeHebrew?: string;
  favicon?: string;
  timeAgo: string;
  isBreaking?: boolean;
  isVerified?: boolean;
  isHebrew?: boolean;
  featured?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'מימון': <DollarSign className="w-3.5 h-3.5" />,
  'חומרה': <Cpu className="w-3.5 h-3.5" />,
  'מוצר': <Boxes className="w-3.5 h-3.5" />,
  'שווקים': <LineChart className="w-3.5 h-3.5" />,
  'מחקר': <FlaskConical className="w-3.5 h-3.5" />,
};

const sourceTypeIcons: Record<string, React.ReactNode> = {
  'official': <CheckCircle2 className="w-3 h-3" />,
  'local': <Flag className="w-3 h-3" />,
  'tech': <Globe className="w-3 h-3" />,
  'research': <BookOpen className="w-3 h-3" />,
  'community': <Users className="w-3 h-3" />,
};

export default function NewsCard({
  title,
  headline,
  summary,
  summaryBullets,
  category,
  source,
  sourceUrl,
  sourceType = 'tech',
  sourceTypeHebrew = 'חדשות',
  favicon,
  timeAgo,
  isBreaking,
  isVerified,
  isHebrew,
  featured
}: NewsCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  return (
    <article
      className={`glass-card p-6 group cursor-pointer ${featured ? 'col-span-full lg:col-span-2' : ''}`}
    >
      {/* Top Row: Category + Source Type + Breaking */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Category Badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white badge-${category}`}>
          {categoryIcons[category]}
          {category}
        </span>

        {/* Source Type Badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white source-badge-${sourceType}`}>
          {sourceTypeIcons[sourceType]}
          {sourceTypeHebrew}
        </span>

        {/* Verified Badge */}
        {isVerified && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full verified-badge text-xs font-medium text-white">
            <CheckCircle2 className="w-3 h-3" />
            מאומת
          </span>
        )}

        {/* Hebrew/Local Badge */}
        {isHebrew && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-xs text-blue-300">
            <Flag className="w-3 h-3" />
            עברית
          </span>
        )}

        {/* Breaking Badge */}
        {isBreaking && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-xs text-red-400 breaking-pulse">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            מבזק
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-bold mb-2 leading-tight group-hover:text-purple-400 transition-colors ${featured ? 'text-xl lg:text-2xl' : 'text-lg'}`}>
        {title}
      </h3>

      {/* Headline */}
      <p className="text-sm text-purple-400/80 mb-3 leading-relaxed">{headline}</p>

      {/* Summary */}
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-sm text-purple-300 transition-all"
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
            <div className="summary-panel mt-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20">
              <ul className="space-y-2">
                {summaryBullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0"></span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Footer with Source Info */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {/* Favicon */}
          {favicon && !faviconError && (
            <div className="favicon-container">
              <img
                src={favicon}
                alt={source}
                onError={() => setFaviconError(true)}
                className="w-4 h-4"
              />
            </div>
          )}

          {/* Source Name */}
          <span className="font-medium">{source}</span>

          <span className="text-gray-600">•</span>

          {/* Time */}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo}
          </span>
        </div>

        {/* Read More Link */}
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          קרא עוד
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
