'use client';

import { Zap, Search, Bell, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-x-0 border-t-0 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 blur-lg opacity-50"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">AI Pulse</h1>
              <p className="text-xs text-gray-400 -mt-1">ישראל</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm text-gray-300 hover:text-white hover-underline transition-colors">חדשות</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white hover-underline transition-colors">כלים</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white hover-underline transition-colors">מחקר</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white hover-underline transition-colors">אודות</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all">
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">חיפוש...</span>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-xs bg-white/10 rounded font-mono">⌘K</kbd>
            </button>

            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">חדשות</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">כלים</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">מחקר</a>
              <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">אודות</a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
