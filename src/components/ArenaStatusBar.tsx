import React, { useEffect, useState } from 'react';
import { Flame, Moon, ShieldCheck, Sun, Volume2, VolumeX, Wifi } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Language } from '../types';
import { getRankFromXp, MOTIVATIONAL_QUOTES } from '../data/translations';

interface ArenaStatusBarProps {
  xp: number;
  streakDays: number;
  streakFreezes: number;
  streakCelebrationCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  lowDataMode: boolean;
  onToggleLowData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  quoteIndex: number;
}

const SPARK_VECTORS = [
  { x: -12, y: -12 },
  { x: 12, y: -12 },
  { x: -14, y: 6 },
  { x: 14, y: 6 },
];

export const ArenaStatusBar: React.FC<ArenaStatusBarProps> = ({
  xp,
  streakDays,
  streakFreezes,
  streakCelebrationCount,
  language,
  onLanguageChange,
  darkMode,
  onToggleDark,
  lowDataMode,
  onToggleLowData,
  soundEnabled,
  onToggleSound,
  quoteIndex,
}) => {
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (streakCelebrationCount === 0) return;
    setCelebrating(true);
    const timer = setTimeout(() => setCelebrating(false), 3200);
    return () => clearTimeout(timer);
  }, [streakCelebrationCount]);

  const rankInfo = getRankFromXp(xp);
  const quotes = MOTIVATIONAL_QUOTES[language];
  const activeQuote = quotes[quoteIndex % quotes.length];

  return (
    <MotionConfig reducedMotion="user">
      <div className="border-b border-[#22223B]/10 dark:border-white/10 bg-white/75 dark:bg-[#19163C]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Always-visible Streak Flame (with daily challenge celebration animation), XP Progress Bar, Rank */}
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="relative flex items-center gap-1.5 font-semibold text-[#FF7A1A]"
              title={`${streakFreezes} streak freeze tokens ready`}
            >
              <div className="relative flex items-center justify-center w-5 h-5">
                {/* Expanding ember halo ring when daily challenge completes */}
                <AnimatePresence>
                  {celebrating && !lowDataMode && (
                    <motion.span
                      key={`halo-${streakCelebrationCount}`}
                      initial={{ scale: 0.5, opacity: 0.9 }}
                      animate={{ scale: 2.1, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 rounded-full border-2 border-[#FFC83D] pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>

                {/* Radial spark particles */}
                <AnimatePresence>
                  {celebrating &&
                    !lowDataMode &&
                    SPARK_VECTORS.map((vec, i) => (
                      <motion.span
                        key={`spark-${streakCelebrationCount}-${i}`}
                        initial={{ x: 0, y: 0, scale: 0.6, opacity: 1 }}
                        animate={{ x: vec.x, y: vec.y, scale: 1.1, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute w-1.5 h-1.5 rounded-full bg-[#FFC83D] pointer-events-none"
                        aria-hidden="true"
                      />
                    ))}
                </AnimatePresence>

                {/* Animated Streak Flame Icon */}
                <motion.div
                  key={`flame-${streakCelebrationCount}`}
                  animate={
                    celebrating && !lowDataMode
                      ? {
                          scale: [1, 1.55, 0.9, 1.25, 1],
                          rotate: [0, -12, 12, -6, 0],
                        }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  <Flame
                    className={`w-4 h-4 ${
                      streakDays > 0 || celebrating
                        ? 'fill-[#FF7A1A] text-[#FF7A1A]'
                        : 'text-[#FF7A1A]/65'
                    }`}
                  />
                </motion.div>
              </div>

              {/* Animated Streak Counter Roll */}
              <div className="relative overflow-hidden h-5 flex items-center">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={streakDays}
                    initial={lowDataMode ? false : { y: 12, opacity: 0, scale: 0.85 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={lowDataMode ? undefined : { y: -12, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="font-score text-sm inline-block"
                  >
                    {streakDays}d
                  </motion.span>
                </AnimatePresence>
              </div>

              <span className="text-[#22223B]/60 dark:text-white/60 font-normal hidden sm:inline">
                · {streakFreezes} freeze
              </span>

              {/* Brief +1d Streak Reinforced Feedback */}
              <AnimatePresence>
                {celebrating && (
                  <motion.span
                    key={`badge-${streakCelebrationCount}`}
                    initial={{ opacity: 0, x: -6, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="ml-1 font-score text-[11px] font-bold text-[#158058] dark:text-[#22C58B] whitespace-nowrap"
                  >
                    +1d Streak Ignited!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <span className="text-[#22223B]/20 dark:text-white/20" aria-hidden="true">|</span>

            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-[#3B2FBF] dark:text-[#FFC83D] flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {rankInfo.tier}
              </span>
              <div className="w-20 sm:w-28 h-2 rounded-full bg-[#22223B]/10 dark:bg-white/10 overflow-hidden" aria-label="XP progress">
                <div
                  className="h-full bg-[#FFC83D] transition-all duration-300"
                  style={{ width: `${rankInfo.progressPercent}%` }}
                />
              </div>
              <span className="font-score font-bold text-[#22223B] dark:text-white">
                {xp.toLocaleString()} XP
              </span>
            </div>
          </div>

          {/* Center (Desktop): Daily Motivational Nudge */}
          <div className="hidden xl:flex items-center gap-2 text-[#22223B]/70 dark:text-white/75 max-w-md truncate">
            <span className="font-semibold text-[#3B2FBF] dark:text-[#FFC83D]">Daily Focus:</span>
            <span className="truncate">{activeQuote.quote}</span>
          </div>

          {/* Right: Language Switcher (EN / বাং / हिं) + Dark Mode + Low-Data */}
          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center rounded-lg border border-[#22223B]/15 dark:border-white/15 p-0.5 bg-[#FFF9F0] dark:bg-[#12102B]"
              role="group"
              aria-label="Language switcher"
            >
              {(
                [
                  { code: 'en', label: 'EN' },
                  { code: 'bn', label: 'বাং' },
                  { code: 'hi', label: 'हिं' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => onLanguageChange(opt.code)}
                  className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    language === opt.code
                      ? 'bg-[#3B2FBF] text-white'
                      : 'text-[#22223B]/75 dark:text-white/75 hover:text-[#3B2FBF] dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onToggleLowData}
              title="Toggle Low-Data Mode (reduces animations & heavy visuals)"
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                lowDataMode
                  ? 'border-[#22C58B] bg-[#22C58B]/15 text-[#147a55] dark:text-[#22C58B]'
                  : 'border-[#22223B]/15 dark:border-white/15 text-[#22223B]/75 dark:text-white/75 hover:border-[#3B2FBF]/40'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lowDataMode ? 'Lite On' : 'Lite'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundEnabled ? 'Mute answer sounds' : 'Enable answer sounds'}
              title={soundEnabled ? 'Sounds On' : 'Sounds Muted'}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'border-[#3B2FBF]/30 dark:border-[#FFC83D]/40 text-[#3B2FBF] dark:text-[#FFC83D]'
                  : 'border-[#22223B]/15 dark:border-white/15 text-[#22223B]/45 dark:text-white/45'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onToggleDark}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-lg border border-[#22223B]/15 dark:border-white/15 text-[#22223B] dark:text-[#FFC83D] hover:border-[#3B2FBF]/40 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};
