import React, { useEffect, useMemo, useState } from 'react';
import {
  BattleHistoryItem,
  ExamId,
  Language,
  MockAttemptRecord,
  PageView,
  PYQQuestion,
  UserProfile,
} from './types';
import { UI_TEXT } from './data/translations';
import { DEFAULT_USER_PROFILE, INITIAL_LEADERBOARD } from './data/pyqDatabase';
import { Navbar } from './components/Navbar';
import { ArenaStatusBar } from './components/ArenaStatusBar';
import { HomePage } from './components/HomePage';
import { PracticeDashboard } from './components/PracticeDashboard';
import { BattleArena } from './components/BattleArena';
import { MockTestArena } from './components/MockTestArena';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { LeaderboardView, ProfileView } from './components/LeaderboardAndProfile';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { playStreakSound } from './utils/soundEffects';

const STORAGE_KEY = 'pyq_battle_arena_profile_v2';
const THEME_KEY = 'pyq_battle_theme_dark';
const SOUND_KEY = 'pyq_battle_sound_enabled';

export default function App() {
  const [activePage, setActivePage] = useState<PageView>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(SOUND_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });
  const [lowDataMode, setLowDataMode] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [selectedExam, setSelectedExam] = useState<ExamId | 'ALL'>('ALL');
  const [topicDrillFilter, setTopicDrillFilter] = useState('');
  const [streakCelebrationCount, setStreakCelebrationCount] = useState(0);
  const [confettiState, setConfettiState] = useState<{
    key: number;
    intensity: 'normal' | 'victory';
  }>({ key: 0, intensity: 'normal' });

  const triggerConfetti = (intensity: 'normal' | 'victory' = 'normal') => {
    setConfettiState((prev) => ({ key: prev.key + 1, intensity }));
  };

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as UserProfile;
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_USER_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage errors
    }
  }, [profile]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, String(darkMode));
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  const handleToggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next && !profile.unlockedBadges.includes('night-owl')) {
      setProfile((prev) => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, 'night-owl'],
      }));
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    if ((lang === 'bn' || lang === 'hi') && !profile.unlockedBadges.includes('bengali-topper')) {
      setProfile((prev) => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, 'bengali-topper'],
      }));
    }
  };

  const handleSolveQuestion = (
    question: PYQQuestion,
    isCorrect: boolean,
    isDailyBonus = false
  ) => {
    const completingDaily = isDailyBonus && !profile.dailyChallengeDone;

    setProfile((prev) => {
      const alreadySolved = prev.solvedIds.includes(question.id);
      const nextSolved = alreadySolved ? prev.solvedIds : [...prev.solvedIds, question.id];
      const nextCorrect =
        isCorrect && !prev.correctIds.includes(question.id)
          ? [...prev.correctIds, question.id]
          : prev.correctIds;

      const dailyNow = isDailyBonus && !prev.dailyChallengeDone;
      const xpGain = (isCorrect && !alreadySolved ? 20 : 5) + (dailyNow ? 50 : 0);
      const nextCalendar = dailyNow
        ? [...prev.activityCalendar.slice(0, -1), true]
        : prev.activityCalendar;

      return {
        ...prev,
        xp: prev.xp + xpGain,
        streakDays: dailyNow ? prev.streakDays + 1 : prev.streakDays,
        activityCalendar: nextCalendar,
        solvedIds: nextSolved,
        correctIds: nextCorrect,
        dailyChallengeDone: prev.dailyChallengeDone || isDailyBonus,
      };
    });

    if (isCorrect) {
      triggerConfetti('normal');
    }

    if (completingDaily) {
      setStreakCelebrationCount((c) => c + 1);
      setTimeout(() => playStreakSound(soundEnabled), 240);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setProfile((prev) => {
      const exists = prev.bookmarkedIds.includes(id);
      return {
        ...prev,
        bookmarkedIds: exists
          ? prev.bookmarkedIds.filter((b) => b !== id)
          : [...prev.bookmarkedIds, id],
      };
    });
  };

  const handleBattleComplete = (
    record: BattleHistoryItem,
    unlockedFastBadge: boolean,
    zeroMistakes: boolean
  ) => {
    setProfile((prev) => {
      const nextBadges = new Set(prev.unlockedBadges);
      if (unlockedFastBadge) nextBadges.add('speed-demon');
      if (zeroMistakes) nextBadges.add('zero-mistakes');
      return {
        ...prev,
        xp: prev.xp + record.xpEarned,
        battleHistory: [record, ...prev.battleHistory].slice(0, 12),
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const handleMockComplete = (record: MockAttemptRecord) => {
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + 75,
      mockAttempts: [record, ...prev.mockAttempts].slice(0, 10),
    }));
  };

  const handleSelectExamFromHome = (exam: ExamId) => {
    setSelectedExam(exam);
    setTopicDrillFilter('');
    setActivePage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTopicDrill = (topic: string) => {
    setSelectedExam('ALL');
    setTopicDrillFilter(topic);
    setActivePage('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: PageView) => {
    if (page !== 'practice') {
      setTopicDrillFilter('');
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const userRank = useMemo(() => {
    const ahead = INITIAL_LEADERBOARD.filter((e) => e.xp > profile.xp).length;
    return ahead + 1;
  }, [profile.xp]);

  const t = UI_TEXT[language];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] text-[#22223B] dark:bg-[#12102B] dark:text-[#F4F1EA]">
      <ConfettiCanvas
        burstKey={confettiState.key}
        intensity={confettiState.intensity}
        disabled={lowDataMode}
      />
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        language={language}
        userName={profile.name}
      />

      <ArenaStatusBar
        xp={profile.xp}
        streakDays={profile.streakDays}
        streakFreezes={profile.streakFreezes}
        streakCelebrationCount={streakCelebrationCount}
        language={language}
        onLanguageChange={handleLanguageChange}
        darkMode={darkMode}
        onToggleDark={handleToggleDark}
        lowDataMode={lowDataMode}
        onToggleLowData={() => setLowDataMode((v) => !v)}
        soundEnabled={soundEnabled}
        onToggleSound={() =>
          setSoundEnabled((prev) => {
            const next = !prev;
            try {
              localStorage.setItem(SOUND_KEY, String(next));
            } catch {
              // Ignore storage errors
            }
            return next;
          })
        }
        quoteIndex={quoteIndex}
      />

      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            language={language}
            onLanguageChange={handleLanguageChange}
            onNavigate={handleNavigate}
            onSelectExam={handleSelectExamFromHome}
            leaderboard={INITIAL_LEADERBOARD}
            userXp={profile.xp}
            userRank={userRank}
            lowDataMode={lowDataMode}
            quoteIndex={quoteIndex}
            onNextQuote={() => setQuoteIndex((i) => i + 1)}
          />
        )}

        {activePage === 'practice' && (
          <PracticeDashboard
            key={topicDrillFilter || 'default'}
            language={language}
            selectedExam={selectedExam}
            onSelectExam={setSelectedExam}
            initialTopicFilter={topicDrillFilter}
            solvedIds={profile.solvedIds}
            correctIds={profile.correctIds}
            bookmarkedIds={profile.bookmarkedIds}
            dailyChallengeDone={profile.dailyChallengeDone}
            soundEnabled={soundEnabled}
            onSolveQuestion={handleSolveQuestion}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activePage === 'battle' && (
          <BattleArena
            language={language}
            userName={profile.name}
            userAvatarId={profile.avatarId}
            soundEnabled={soundEnabled}
            onTriggerConfetti={triggerConfetti}
            onBattleComplete={handleBattleComplete}
          />
        )}

        {activePage === 'mocks' && (
          <MockTestArena
            language={language}
            onLanguageChange={handleLanguageChange}
            onMockComplete={handleMockComplete}
          />
        )}

        {activePage === 'leaderboard' && (
          <LeaderboardView entries={INITIAL_LEADERBOARD} profile={profile} />
        )}

        {activePage === 'analytics' && (
          <AnalyticsDashboard
            profile={profile}
            onStartTopicDrill={handleStartTopicDrill}
          />
        )}

        {activePage === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={(updates) =>
              setProfile((prev) => ({ ...prev, ...updates }))
            }
            onUseStreakFreeze={() =>
              setProfile((prev) =>
                prev.streakFreezes > 0
                  ? {
                      ...prev,
                      streakFreezes: prev.streakFreezes - 1,
                      streakDays: prev.streakDays + 1,
                    }
                  : prev
              )
            }
          />
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-[#22223B]/10 dark:border-white/10 bg-white/60 dark:bg-[#19163C]/70 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#22223B]/75 dark:text-white/75">
          <div className="space-y-1">
            <div className="font-display text-base font-bold text-[#3B2FBF] dark:text-[#FFC83D]">
              PYQ Battle · Exam Arena
            </div>
            <div>{t.footerCredit} · Compete. Learn. Conquer.</div>
          </div>

          <div className="flex flex-wrap gap-4 font-medium">
            <button type="button" onClick={() => handleNavigate('practice')} className="hover:underline cursor-pointer">
              10-Year PYQs (JEE · NEET · WBJEE · GATE · UPSC · AFCAT · IISER · ICAR)
            </button>
            <button type="button" onClick={() => handleNavigate('battle')} className="hover:underline cursor-pointer">
              Battle Arena
            </button>
            <button type="button" onClick={() => handleNavigate('mocks')} className="hover:underline cursor-pointer">
              Mock Tests
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
