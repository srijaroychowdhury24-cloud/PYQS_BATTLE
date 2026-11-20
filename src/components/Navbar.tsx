import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Language, PageView } from '../types';
import { UI_TEXT } from '../data/translations';

interface NavbarProps {
  activePage: PageView;
  onNavigate: (page: PageView) => void;
  language: Language;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  language,
  userName,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = UI_TEXT[language];

  const navItems: { id: PageView; label: string }[] = [
    { id: 'practice', label: t.nav.practice },
    { id: 'battle', label: t.nav.battle },
    { id: 'mocks', label: t.nav.mocks },
    { id: 'leaderboard', label: t.nav.leaderboard },
    { id: 'analytics', label: t.nav.analytics },
  ];

  const handleNav = (id: PageView) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#22223B]/10 dark:border-white/10 bg-[#FFF9F0]/95 dark:bg-[#12102B]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Title */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-display text-xl font-extrabold tracking-tight text-[#3B2FBF] dark:text-white whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A1A]"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#3B2FBF] text-white text-sm font-bold">
            P
          </span>
          <span>{t.brand}</span>
        </button>

        {/* Zone 2: 5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`relative py-1 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#3B2FBF] dark:text-[#FFC83D]'
                    : 'text-[#22223B]/75 dark:text-white/75 hover:text-[#3B2FBF] dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#FF7A1A] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('profile')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activePage === 'profile'
                ? 'bg-[#3B2FBF] text-white'
                : 'bg-[#FF7A1A] text-white hover:bg-[#e86a0c]'
            }`}
          >
            {userName.trim() ? `${userName.trim().split(' ')[0]} · ${t.nav.profile}` : t.nav.profile}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg border border-[#22223B]/15 dark:border-white/15 text-[#22223B] dark:text-white cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#22223B]/10 dark:border-white/10 bg-[#FFF9F0] dark:bg-[#12102B] px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#3B2FBF]/10 text-[#3B2FBF] dark:bg-white/10 dark:text-[#FFC83D]'
                    : 'text-[#22223B]/80 dark:text-white/80'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
