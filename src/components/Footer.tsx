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
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
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
          <p className="text-sm text-gray-500">
            © 2026 AI Pulse ישראל. כל הזכויות שמורות.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-400 transition-colors">מדיניות פרטיות</a>
            <a href="#" className="hover:text-gray-400 transition-colors">תנאי שימוש</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
