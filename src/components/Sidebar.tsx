'use client';

import { TrendingUp, Code, Brain, Cpu, Video, Sparkles, ArrowLeft } from 'lucide-react';

interface AITool {
  name: string;
  company: string;
  description: string;
  trending: boolean;
  category: string;
}

interface SidebarProps {
  tools: AITool[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  'קידוד': <Code className="w-4 h-4" />,
  'LLM': <Brain className="w-4 h-4" />,
  'חומרה': <Cpu className="w-4 h-4" />,
  'וידאו': <Video className="w-4 h-4" />,
  Coding: <Code className="w-4 h-4" />,
  Hardware: <Cpu className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
};

export default function Sidebar({ tools }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Top AI Tools */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-lg">כלי AI מובילים</h3>
        </div>

        <div className="space-y-4">
          {tools.map((tool, index) => (
            <div
              key={tool.name}
              className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-violet-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center text-violet-400">
                    {categoryIcons[tool.category] || <Brain className="w-4 h-4" />}
                  </div>
                </div>
                {tool.trending && (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    חם
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                {tool.name}
              </h4>
              <p className="text-xs text-gray-500 mb-1">{tool.company}</p>
              <p className="text-sm text-gray-400">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="animated-border p-6">
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-2">הישארו בחזית ה-AI</h3>
          <p className="text-sm text-gray-400 mb-4">
            קבלו את חדשות ה-AI העדכניות ביותר ישירות למייל כל בוקר.
          </p>

          <div className="space-y-3">
            <input
              type="email"
              placeholder="הכניסו את המייל שלכם"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors text-right"
            />
            <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 font-medium text-sm flex items-center justify-center gap-2 transition-all group">
              הרשמה
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            הצטרפו ל-50,000+ חובבי AI
          </p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          שוק בזמן אמת
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
            <span className="text-sm text-gray-400 font-mono">NVDA</span>
            <span className="text-sm font-mono text-green-400">+2.34%</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
            <span className="text-sm text-gray-400 font-mono">MSFT</span>
            <span className="text-sm font-mono text-green-400">+1.12%</span>
          </div>
          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
            <span className="text-sm text-gray-400 font-mono">GOOGL</span>
            <span className="text-sm font-mono text-red-400">-0.45%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
