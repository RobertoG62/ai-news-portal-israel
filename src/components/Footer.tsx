'use client';

import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">AI Pulse ישראל</h3>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md mb-6">
              המקור המוביל שלכם לחדשות AI, תובנות וניתוחים.
              מכסים את ההתפתחויות האחרונות מ-OpenAI, Anthropic, NVIDIA ועוד.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="X (טוויטר)" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="GitHub" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" aria-label="ערוץ טלגרם" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">קישורים מהירים</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-violet-400 transition-colors">חדשות אחרונות</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">כלי AI</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">מאמרי מחקר</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">פודקאסט</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">החברה</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-violet-400 transition-colors">אודותינו</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">צור קשר</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">פרסום</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">קריירה</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 max-w-xl leading-6">
            © 2026 AI Pulse ישראל. כל הזכויות שמורות.
            <br />
            <b>הכותרות והסיכומים מתורגמים ומתומצתים אוטומטית ואינם נערכים על ידי אדם לפני פרסום.</b> לפני הסתמכות — קראו את המקור.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            {/* These pointed at href="#" - links that looked like policy pages
                and went nowhere, which is worse than having none. */}
            <a href="/privacy" className="underline hover:text-gray-200 transition-colors">מדיניות פרטיות</a>
            <a href="/terms" className="underline hover:text-gray-200 transition-colors">תנאי שימוש</a>
            <a href="/accessibility" className="underline hover:text-gray-200 transition-colors">הצהרת נגישות</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
