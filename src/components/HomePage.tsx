import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Clock,
  Swords,
  Trophy,
  Sparkles,
  Quote,
} from 'lucide-react';
import { ExamId, Language, LeaderboardEntry, PageView } from '../types';
import { EXAM_CATALOG, MOTIVATIONAL_QUOTES, UI_TEXT } from '../data/translations';
import { HeroDuelIllustration, StudentAvatar, TigerMascot } from './MascotAndVisuals';

interface HomePageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (page: PageView) => void;
  onSelectExam: (exam: ExamId) => void;
  leaderboard: LeaderboardEntry[];
  userXp: number;
  userRank: number;
  lowDataMode: boolean;
  quoteIndex: number;
  onNextQuote: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  language,
  onLanguageChange,
  onNavigate,
  onSelectExam,
  leaderboard,
  userXp,
  userRank,
  lowDataMode,
  quoteIndex,
  onNextQuote,
}) => {
  const [flippedExam, setFlippedExam] = useState<ExamId | null>(null);
  const t = UI_TEXT[language];
  const quoteList = MOTIVATIONAL_QUOTES[language];
  const activeQuote = quoteList[quoteIndex % quoteList.length];

  const liveActivity = [
    'Riya (Kolkata) won a JEE Physics duel · +95 XP',
    '1,240 students active across 8 exam arenas',
    'Aarav (Patna) hit a 19-day study streak',
    'WBJEE 2016–2025 Mathematics archive updated',
    'Ananya (Siliguri) scored 92% in NEET Mock #4',
  ];

  const stories = [
    {
      name: 'Riya Chatterjee',
      exam: 'WBJEE & JEE Main',
      city: 'Kolkata',
      avatar: 'avatar-1',
      quote:
        'Switching between English and বাংলা helped me grasp electrostatics twice as fast during late-night revisions.',
    },
    {
      name: 'Aarav Verma',
      exam: 'GATE CS 2025',
      city: 'Patna',
      avatar: 'avatar-2',
      quote:
        'Ten years of GATE PYQs sorted by topic saved me hours. 1v1 battles kept my evening focus sharp.',
    },
    {
      name: 'Ananya Sen',
      exam: 'IISER IAT & NEET',
      city: 'Siliguri',
      avatar: 'avatar-3',
      quote:
        'The analytics heatmap caught my thermodynamics dip early, and the 10-minute drills boosted my accuracy by 18%.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <p className="text-sm font-semibold text-[#3B2FBF] dark:text-[#FFC83D] tracking-wide">
              {t.hero.tagline}
            </p>

            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-[#22223B] dark:text-white"
              style={{ textWrap: 'balance' }}
            >
              {t.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-[#22223B]/80 dark:text-white/80 max-w-2xl leading-relaxed">
              {t.hero.subline}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('battle')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF7A1A] text-white font-semibold text-base hover:bg-[#e5680d] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Swords className="w-5 h-5" />
                <span>{t.hero.ctaBattle}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('practice')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#3B2FBF] dark:border-[#FFC83D] text-[#3B2FBF] dark:text-[#FFC83D] font-semibold text-base hover:bg-[#3B2FBF]/5 dark:hover:bg-[#FFC83D]/10 transition-colors cursor-pointer whitespace-nowrap"
              >
                <BookOpen className="w-5 h-5" />
                <span>{t.hero.ctaPractice}</span>
              </button>
            </div>

            {/* Interactive Language Selection Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-sm">
              <span className="text-[#22223B]/65 dark:text-white/65">{t.hero.availableIn}</span>
              <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-[#1A1740] border border-[#22223B]/10 dark:border-white/10">
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'bn', label: 'বাংলা' },
                    { code: 'hi', label: 'हिन्दी' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => onLanguageChange(item.code)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      language === item.code
                        ? 'bg-[#3B2FBF] text-white'
                        : 'text-[#22223B]/75 dark:text-white/75 hover:text-[#3B2FBF] dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Duel Card */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <HeroDuelIllustration onStartDuel={() => onNavigate('battle')} />
          </div>
        </div>

        {/* 4-Column Quantitative Proof Strip Below Hero */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 border-y border-[#22223B]/10 dark:border-white/10 py-5">
          <div>
            <div className="font-score text-2xl font-bold text-[#3B2FBF] dark:text-[#FFC83D]">10 Years</div>
            <div className="text-xs text-[#22223B]/70 dark:text-white/70 mt-0.5">2016–2025 Previous Papers</div>
          </div>
          <div>
            <div className="font-score text-2xl font-bold text-[#FF7A1A]">8 Exams</div>
            <div className="text-xs text-[#22223B]/70 dark:text-white/70 mt-0.5">JEE, NEET, WBJEE, GATE, UPSC, AFCAT, IISER, ICAR</div>
          </div>
          <div>
            <div className="font-score text-2xl font-bold text-[#22C58B]">3 Scripts</div>
            <div className="text-xs text-[#22223B]/70 dark:text-white/70 mt-0.5">English, বাংলা & हिन्दी</div>
          </div>
          <div>
            <div className="font-score text-2xl font-bold text-[#22223B] dark:text-white">60s</div>
            <div className="text-xs text-[#22223B]/70 dark:text-white/70 mt-0.5">Live 1v1 & Squad Matchmaking</div>
          </div>
        </div>
      </section>

      {/* 2. LIVE ARENA TICKER & MOTIVATIONAL STUDY QUOTE */}
      <section className="space-y-6">
        {!lowDataMode && (
          <div className="border-y border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] py-2.5 overflow-hidden">
            <div className="animate-marquee flex items-center gap-10 text-xs font-medium text-[#22223B]/80 dark:text-white/80">
              {[...liveActivity, ...liveActivity].map((item, idx) => (
                <span key={idx} className="whitespace-nowrap flex items-center gap-3">
                  <span>{item}</span>
                  <span aria-hidden="true" className="text-[#FF7A1A]">·</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-[#3B2FBF] text-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TigerMascot mood="cheer" size={64} className="shrink-0 hidden sm:block" />
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FFC83D]">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Daily Study Spark · {activeQuote.author}</span>
                </div>
                <p className="text-base sm:text-lg font-medium mt-1 leading-snug">
                  “{activeQuote.quote}”
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNextQuote}
              className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              Next Quote
            </button>
          </div>
        </div>
      </section>

      {/* 3. PICK YOUR EXAM (10-YEAR ARCHIVE: JEE, NEET, WBJEE, GATE, UPSC, AFCAT, IISER, ICAR) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#22223B] dark:text-white">
              {t.sections.pickExamTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#22223B]/75 dark:text-white/75 mt-1">
              {t.sections.pickExamSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B2FBF] dark:text-[#FFC83D] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Full PYQ Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EXAM_CATALOG.map((exam) => {
            const isFlipped = flippedExam === exam.id;
            return (
              <div
                key={exam.id}
                onMouseEnter={() => setFlippedExam(exam.id)}
                onMouseLeave={() => setFlippedExam(null)}
                className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 flex flex-col justify-between min-h-[196px] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {!isFlipped ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#22223B]/60 dark:text-white/60">
                        <span>{exam.yearsCovered}</span>
                        <span className="font-score font-bold text-[#FF7A1A]">
                          {exam.totalQuestionsArchive.toLocaleString()}+ PYQs
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold mt-2 text-[#22223B] dark:text-white">
                        {exam.name}
                      </h3>
                      <p className="text-xs text-[#22223B]/70 dark:text-white/70 mt-1">
                        {exam.tagline[language]}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#22223B]/10 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-[#22223B]/60 dark:text-white/60 truncate pr-2">
                        {exam.subjects.join(' · ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectExam(exam.id)}
                        className="text-xs font-semibold text-[#3B2FBF] dark:text-[#FFC83D] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Practice →
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <div className="text-xs font-semibold text-[#3B2FBF] dark:text-[#FFC83D]">
                        {exam.fullName}
                      </div>
                      <div className="font-score text-2xl font-bold text-[#22223B] dark:text-white mt-2">
                        {exam.totalQuestionsArchive.toLocaleString()} Questions
                      </div>
                      <p className="text-xs text-[#22223B]/75 dark:text-white/75 mt-1">
                        Decade archive: 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 & 2025.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectExam(exam.id)}
                      className="mt-4 w-full py-2 px-4 rounded-lg bg-[#FF7A1A] text-white text-xs font-semibold hover:bg-[#e5680d] transition-colors cursor-pointer"
                    >
                      Launch {exam.id} PYQ Bank
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FOUR CORE GAME MODES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#22223B] dark:text-white">
            {t.sections.modesTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#22223B]/75 dark:text-white/75 mt-1">
            {t.sections.modesSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Topic-Wise PYQs',
              desc: 'Filter 10 years of questions by exam, subject, year, and difficulty with instant step-by-step solutions.',
              icon: BookOpen,
              actionLabel: 'Browse Bank',
              target: 'practice' as PageView,
              accent: 'text-[#3B2FBF] dark:text-[#FFC83D]',
            },
            {
              title: 'Multiplayer Battles',
              desc: '1v1 duels, 4-player squads, or friend challenges with live circular timers and XP rewards.',
              icon: Swords,
              actionLabel: 'Enter Lobby',
              target: 'battle' as PageView,
              accent: 'text-[#FF7A1A]',
            },
            {
              title: 'Timed Mock Tests',
              desc: 'Authentic exam-hall OMR question palette, negative marking, and instant language switching mid-test.',
              icon: Clock,
              actionLabel: 'Take a Mock',
              target: 'mocks' as PageView,
              accent: 'text-[#22C58B]',
            },
            {
              title: 'Performance Analytics',
              desc: 'Topic heatmaps, subject radar charts, and targeted 10-minute drills for weak chapters.',
              icon: BarChart3,
              actionLabel: 'View Insights',
              target: 'analytics' as PageView,
              accent: 'text-[#3B2FBF] dark:text-[#FFC83D]',
            },
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <div
                key={mode.title}
                className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 flex flex-col justify-between"
              >
                <div>
                  <Icon className={`w-7 h-7 ${mode.accent}`} />
                  <h3 className="font-display text-lg font-bold mt-4 text-[#22223B] dark:text-white">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-[#22223B]/75 dark:text-white/75 mt-2 leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(mode.target)}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3B2FBF] dark:text-[#FFC83D] hover:underline cursor-pointer"
                >
                  <span>{mode.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HOW A BATTLE WORKS (3 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#22223B] dark:text-white">
          {t.sections.howBattleTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              step: '01. Pick Exam & Topic',
              desc: 'Select JEE, NEET, WBJEE, GATE, UPSC, AFCAT, IISER, or ICAR and choose 5, 10, or 15 PYQs.',
            },
            {
              step: '02. Match With a Rival',
              desc: 'Get paired in seconds with a peer at your rank tier or invite a classmate via a battle link.',
            },
            {
              step: '03. Answer Fast & Earn XP',
              desc: 'Speed and accuracy earn bonus XP, push your rank from Rookie to Legend, and guard your streak.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6"
            >
              <div className="font-score text-sm font-bold text-[#FF7A1A]">{item.step}</div>
              <p className="text-sm text-[#22223B]/80 dark:text-white/80 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7 & 8. LEADERBOARD PREVIEW + ANALYTICS PREVIEW SIDE-BY-SIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Leaderboard Preview */}
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#22223B] dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFC83D]" />
                <span>{t.sections.leaderboardTitle}</span>
              </h2>
              <span className="font-score text-xs font-semibold text-[#3B2FBF] dark:text-[#FFC83D]">
                Your Rank: #{userRank}
              </span>
            </div>

            <div className="mt-4 divide-y divide-[#22223B]/10 dark:divide-white/10">
              {leaderboard.slice(0, 5).map((entry, idx) => (
                <div key={entry.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-score w-5 text-xs font-bold text-[#22223B]/60 dark:text-white/60">
                      #{idx + 1}
                    </span>
                    <StudentAvatar avatarId={entry.avatarId} size={32} />
                    <div className="truncate">
                      <div className="font-semibold truncate">{entry.name}</div>
                      <div className="text-xs text-[#22223B]/60 dark:text-white/60 truncate">{entry.city}</div>
                    </div>
                  </div>
                  <div className="font-score text-xs font-bold text-[#3B2FBF] dark:text-[#FFC83D] whitespace-nowrap">
                    {entry.weeklyXp.toLocaleString()} XP
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#22223B]/10 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#22223B]/70 dark:text-white/70">
              Your current XP: <strong className="font-score">{userXp.toLocaleString()}</strong>
            </span>
            <button
              type="button"
              onClick={() => onNavigate('leaderboard')}
              className="font-semibold text-[#FF7A1A] hover:underline cursor-pointer"
            >
              Full Leaderboard →
            </button>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-[#22223B] dark:text-white">
              {t.sections.analyticsTitle}
            </h2>
            <p className="text-xs text-[#22223B]/70 dark:text-white/70 mt-1">
              Visual radar of subject mastery paired with targeted weak-topic drills.
            </p>

            {/* Clean SVG Subject Radar + Weak Topic Summary */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <svg viewBox="0 0 200 180" className="w-full max-w-[200px] mx-auto" aria-label="Subject strength radar chart">
                {/* Grid rings */}
                <polygon points="100,20 170,60 150,145 50,145 30,60" fill="none" stroke="currentColor" strokeOpacity="0.14" />
                <polygon points="100,45 145,70 132,125 68,125 55,70" fill="none" stroke="currentColor" strokeOpacity="0.14" />
                {/* Data polygon */}
                <polygon
                  points="100,32 158,66 135,132 62,120 42,68"
                  fill="#3B2FBF"
                  fillOpacity="0.22"
                  stroke="#3B2FBF"
                  strokeWidth="2.5"
                />
                <text x="100" y="13" textAnchor="middle" fontSize="10" fill="currentColor">Physics</text>
                <text x="176" y="62" textAnchor="start" fontSize="10" fill="currentColor">Math</text>
                <text x="154" y="160" textAnchor="middle" fontSize="10" fill="currentColor">Chem</text>
                <text x="46" y="160" textAnchor="middle" fontSize="10" fill="currentColor">Bio</text>
                <text x="24" y="62" textAnchor="end" fontSize="10" fill="currentColor">GS</text>
              </svg>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl border border-[#22C58B]/30 bg-[#22C58B]/10">
                  <div className="font-semibold text-[#158058] dark:text-[#22C58B]">Strong · Complex Numbers</div>
                  <div className="font-score text-[#22223B]/75 dark:text-white/75 mt-0.5">88% accuracy · 26s avg</div>
                </div>
                <div className="p-3 rounded-xl border border-[#F2545B]/30 bg-[#F2545B]/10">
                  <div className="font-semibold text-[#b91c24] dark:text-[#F2545B]">Focus Needed · Thermodynamics</div>
                  <div className="font-score text-[#22223B]/75 dark:text-white/75 mt-0.5">44% accuracy · 52s avg</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#22223B]/10 dark:border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#22223B]/70 dark:text-white/70">Smart drills adapt to your mistakes</span>
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="font-semibold text-[#3B2FBF] dark:text-[#FFC83D] hover:underline cursor-pointer"
            >
              Open Analytics →
            </button>
          </div>
        </div>
      </section>

      {/* 9. STUDENT STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#22223B] dark:text-white">
          {t.sections.storiesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stories.map((story) => (
            <div
              key={story.name}
              className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 flex flex-col justify-between"
            >
              <p className="text-sm text-[#22223B]/85 dark:text-white/85 leading-relaxed">
                “{story.quote}”
              </p>
              <div className="mt-4 pt-3 border-t border-[#22223B]/10 dark:border-white/10 flex items-center gap-3">
                <StudentAvatar avatarId={story.avatar} size={36} />
                <div>
                  <div className="text-sm font-semibold">{story.name}</div>
                  <div className="text-xs text-[#22223B]/60 dark:text-white/60">
                    {story.exam} · {story.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-[#3B2FBF] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">
              {t.sections.finalCtaTitle}
            </h2>
            <p className="text-sm text-white/80">
              10-year PYQs, live battles, and multilingual practice ready whenever you are.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('battle')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF7A1A] hover:bg-[#e5680d] text-white font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.sections.finalCtaButton}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
