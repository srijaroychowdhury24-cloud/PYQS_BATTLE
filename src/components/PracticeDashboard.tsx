import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  Search,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { Difficulty, ExamId, Language, PYQQuestion, SubjectName } from '../types';
import { EXAM_CATALOG, MOTIVATIONAL_QUOTES, UI_TEXT } from '../data/translations';
import { PYQ_BANK, YEARS_DECADE } from '../data/pyqDatabase';
import { MascotMood, TigerMascot } from './MascotAndVisuals';
import { playCorrectSound, playWrongSound } from '../utils/soundEffects';

interface PracticeDashboardProps {
  language: Language;
  selectedExam: ExamId | 'ALL';
  onSelectExam: (exam: ExamId | 'ALL') => void;
  initialTopicFilter?: string;
  solvedIds: string[];
  correctIds: string[];
  bookmarkedIds: string[];
  dailyChallengeDone: boolean;
  soundEnabled: boolean;
  onSolveQuestion: (question: PYQQuestion, isCorrect: boolean, isDailyBonus?: boolean) => void;
  onToggleBookmark: (id: string) => void;
}

export const PracticeDashboard: React.FC<PracticeDashboardProps> = ({
  language,
  selectedExam,
  onSelectExam,
  initialTopicFilter = '',
  solvedIds,
  correctIds,
  bookmarkedIds,
  dailyChallengeDone,
  soundEnabled,
  onSolveQuestion,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialTopicFilter);
  const [selectedSubject, setSelectedSubject] = useState<SubjectName | 'ALL'>('ALL');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [viewFilter, setViewFilter] = useState<'all' | 'unsolved' | 'bookmarked'>('all');

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [downloadFeedback, setDownloadFeedback] = useState('');

  const t = UI_TEXT[language];
  const dailyQuestion = PYQ_BANK[0];
  const quote = MOTIVATIONAL_QUOTES[language][0];

  const availableSubjects = useMemo(() => {
    const set = new Set<SubjectName>();
    PYQ_BANK.forEach((q) => {
      if (selectedExam === 'ALL' || q.exam === selectedExam) {
        set.add(q.subject);
      }
    });
    return Array.from(set);
  }, [selectedExam]);

  const filteredQuestions = useMemo(() => {
    return PYQ_BANK.filter((q) => {
      if (selectedExam !== 'ALL' && q.exam !== selectedExam) return false;
      if (selectedSubject !== 'ALL' && q.subject !== selectedSubject) return false;
      if (selectedYear !== 'ALL' && q.year !== selectedYear) return false;
      if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) return false;
      if (viewFilter === 'unsolved' && solvedIds.includes(q.id)) return false;
      if (viewFilter === 'bookmarked' && !bookmarkedIds.includes(q.id)) return false;

      if (searchQuery.trim()) {
        const needle = searchQuery.toLowerCase();
        const hay = `${q.exam} ${q.subject} ${q.topic} ${q.year} ${q.content[language].question} ${q.content.en.question}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    }).sort((a, b) => b.year - a.year);
  }, [
    selectedExam,
    selectedSubject,
    selectedYear,
    selectedDifficulty,
    viewFilter,
    searchQuery,
    solvedIds,
    bookmarkedIds,
    language,
  ]);

  const solvedInFilter = filteredQuestions.filter((q) => solvedIds.includes(q.id)).length;
  const totalInFilter = filteredQuestions.length;
  const progressPct = totalInFilter === 0 ? 0 : Math.round((solvedInFilter / totalInFilter) * 100);

  const handleOptionPick = (q: PYQQuestion, idx: number) => {
    if (selectedAnswers[q.id] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: idx }));
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setMascotMood('cheer');
      playCorrectSound(soundEnabled);
    } else {
      setMascotMood('sulk');
      playWrongSound(soundEnabled);
      setShakeId(q.id);
      setTimeout(() => setShakeId(null), 400);
    }
    const isDaily = q.id === dailyQuestion.id && !dailyChallengeDone;
    onSolveQuestion(q, isCorrect, isDaily);
    setOpenSolutions((prev) => ({ ...prev, [q.id]: true }));
  };

  const resetFilters = () => {
    onSelectExam('ALL');
    setSelectedSubject('ALL');
    setSelectedYear('ALL');
    setSelectedDifficulty('ALL');
    setViewFilter('all');
    setSearchQuery('');
  };

  const handleOfflineDownload = () => {
    const payload = filteredQuestions.map((q) => ({
      id: q.id,
      exam: q.exam,
      subject: q.subject,
      topic: q.topic,
      year: q.year,
      difficulty: q.difficulty,
      question: q.content[language].question,
      options: q.content[language].options,
      answer: q.content[language].options[q.correctIndex],
      explanation: q.content[language].explanation,
    }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pyq-battle-${selectedExam.toLowerCase()}-${language}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadFeedback(`Saved ${payload.length} PYQs for offline study`);
    setTimeout(() => setDownloadFeedback(''), 3000);
  };

  // Progress Ring SVG math
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Dashboard Summary & Daily Study Spark */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-8 rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#22223B] dark:text-white">
              10-Year PYQ Vault (2016–2025)
            </h1>
            <p className="text-sm text-[#22223B]/75 dark:text-white/75">
              Search and filter previous-year papers across JEE, NEET, WBJEE, GATE, UPSC, AFCAT, IISER & ICAR.
            </p>
            <p className="text-xs text-[#3B2FBF] dark:text-[#FFC83D] font-medium pt-1">
              “{quote.quote}”
            </p>
          </div>

          {/* Progress Ring */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeWidth="6"
                />
                <circle
                  cx="30"
                  cy="30"
                  r={radius}
                  fill="none"
                  stroke="#22C58B"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <span className="absolute font-score text-xs font-bold">{progressPct}%</span>
            </div>
            <div>
              <div className="font-score text-lg font-bold">
                {solvedInFilter}/{totalInFilter}
              </div>
              <div className="text-xs text-[#22223B]/65 dark:text-white/65">Solved in view</div>
            </div>
          </div>
        </div>

        {/* Daily Challenge & Mascot Mood Card */}
        <div className="lg:col-span-4 rounded-2xl bg-[#3B2FBF] text-white p-5 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFC83D]">
              <Sparkles className="w-4 h-4" />
              <span>Daily PYQ Challenge · +50 XP</span>
            </div>
            <div className="text-sm font-semibold">
              {dailyChallengeDone
                ? 'Daily Challenge complete! +1d streak flame ignited.'
                : `Solve ${dailyQuestion.exam} ${dailyQuestion.year} (${dailyQuestion.topic})`}
            </div>
            {!dailyChallengeDone && (
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  onSelectExam(dailyQuestion.exam);
                  setSelectedYear(dailyQuestion.year);
                }}
                className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-[#FF7A1A] hover:bg-[#e5680d] text-xs font-semibold cursor-pointer"
              >
                Jump to Daily PYQ
              </button>
            )}
          </div>
          <TigerMascot mood={mascotMood} size={76} className="shrink-0" />
        </div>
      </div>

      {/* Search Bar & Decade Timeline (2025 -> 2016) */}
      <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#22223B]/50 dark:text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topic, formula, exam, or keyword (e.g. Carnot, Okazaki, Repo Rate, 2023)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0] dark:bg-[#12102B] text-sm focus:outline-none focus:border-[#3B2FBF] dark:focus:border-[#FFC83D]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOfflineDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#22223B]/15 dark:border-white/15 text-xs font-semibold hover:border-[#3B2FBF] dark:hover:border-[#FFC83D] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download PYQs</span>
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#22223B]/15 dark:border-white/15 text-xs font-semibold hover:border-[#FF7A1A] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {downloadFeedback && (
          <div className="text-xs font-semibold text-[#158058] dark:text-[#22C58B]">
            {downloadFeedback}
          </div>
        )}

        {/* 10-Year Timeline Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-[#22223B]/60 dark:text-white/60 pr-2 whitespace-nowrap">
            Year (10-Yr):
          </span>
          <button
            type="button"
            onClick={() => setSelectedYear('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              selectedYear === 'ALL'
                ? 'bg-[#3B2FBF] text-white'
                : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/75 dark:text-white/75 hover:text-[#3B2FBF]'
            }`}
          >
            All (2016–2025)
          </button>
          {YEARS_DECADE.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-lg font-score text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                selectedYear === yr
                  ? 'bg-[#FF7A1A] text-white'
                  : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/75 dark:text-white/75 hover:text-[#FF7A1A]'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Left Filters + Right Question Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 space-y-5">
          {/* Exam Filter */}
          <div>
            <label className="block text-xs font-bold text-[#22223B]/70 dark:text-white/70 mb-2">
              Exam Archive
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onSelectExam('ALL');
                  setSelectedSubject('ALL');
                }}
                className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-left cursor-pointer transition-colors ${
                  selectedExam === 'ALL'
                    ? 'bg-[#3B2FBF] text-white'
                    : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/80 dark:text-white/80'
                }`}
              >
                All Exams
              </button>
              {EXAM_CATALOG.map((exam) => (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => {
                    onSelectExam(exam.id);
                    setSelectedSubject('ALL');
                  }}
                  className={`px-2.5 py-2 rounded-lg text-xs font-semibold text-left cursor-pointer transition-colors ${
                    selectedExam === exam.id
                      ? 'bg-[#3B2FBF] text-white'
                      : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/80 dark:text-white/80'
                  }`}
                >
                  {exam.id}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label htmlFor="subject-select" className="block text-xs font-bold text-[#22223B]/70 dark:text-white/70 mb-2">
              Subject
            </label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as SubjectName | 'ALL')}
              className="w-full px-3 py-2 rounded-xl border border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0] dark:bg-[#12102B] text-sm"
            >
              <option value="ALL">All Subjects</option>
              {availableSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs font-bold text-[#22223B]/70 dark:text-white/70 mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-[#FF7A1A] text-white'
                      : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/80 dark:text-white/80'
                  }`}
                >
                  {diff === 'ALL' ? 'Any' : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-[#22223B]/70 dark:text-white/70 mb-2">
              Question Status
            </label>
            <div className="flex flex-col gap-1.5">
              {(
                [
                  { id: 'all', label: 'All Questions' },
                  { id: 'unsolved', label: 'Unsolved Only' },
                  { id: 'bookmarked', label: `Bookmarked (${bookmarkedIds.length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setViewFilter(tab.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold text-left cursor-pointer transition-colors ${
                    viewFilter === tab.id
                      ? 'bg-[#3B2FBF]/10 text-[#3B2FBF] dark:bg-white/10 dark:text-[#FFC83D]'
                      : 'text-[#22223B]/75 dark:text-white/75 hover:bg-[#FFF9F0] dark:hover:bg-[#12102B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Question Feed */}
        <div className="lg:col-span-9 space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-10 text-center space-y-3">
              <TigerMascot mood="sulk" size={88} className="mx-auto" />
              <h3 className="font-display text-xl font-bold">No matching PYQs found</h3>
              <p className="text-sm text-[#22223B]/70 dark:text-white/70 max-w-md mx-auto">
                Try clearing a year or difficulty filter to explore the rest of the 10-year archive.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#3B2FBF] text-white text-sm font-semibold cursor-pointer"
              >
                Show All PYQs
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const localized = q.content[language];
              const picked = selectedAnswers[q.id];
              const isSolvedBefore = solvedIds.includes(q.id);
              const wasCorrectBefore = correctIds.includes(q.id);
              const isBookmarked = bookmarkedIds.includes(q.id);
              const showSol = openSolutions[q.id] ?? false;

              return (
                <article
                  key={q.id}
                  className={`rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 sm:p-6 space-y-4 ${
                    shakeId === q.id ? 'animate-shake' : ''
                  }`}
                >
                  {/* Clean Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#22223B]/65 dark:text-white/65">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#3B2FBF] dark:text-[#FFC83D]">{q.exam}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-score font-semibold">{q.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.difficulty}</span>
                      {isSolvedBefore && picked === undefined && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className={wasCorrectBefore ? 'text-[#22C58B] font-semibold' : 'text-[#FF7A1A] font-semibold'}>
                            {wasCorrectBefore ? 'Solved' : 'Attempted'}
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleBookmark(q.id)}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                      className={`inline-flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors ${
                        isBookmarked
                          ? 'text-[#FF7A1A]'
                          : 'text-[#22223B]/60 dark:text-white/60 hover:text-[#FF7A1A]'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#FF7A1A]' : ''}`} />
                      <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>

                  {/* Question Stem */}
                  <h2 className="text-base sm:text-lg font-semibold leading-relaxed text-[#22223B] dark:text-white">
                    {localized.question}
                  </h2>

                  {/* 4 Interactive Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {localized.options.map((opt, idx) => {
                      const isPicked = picked === idx;
                      const isRightOption = idx === q.correctIndex;
                      let optionStyle =
                        'border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0]/60 dark:bg-[#12102B]/70 hover:border-[#3B2FBF] dark:hover:border-[#FFC83D]';

                      if (picked !== undefined) {
                        if (isRightOption) {
                          optionStyle =
                            'border-[#22C58B] bg-[#22C58B]/15 text-[#146c4c] dark:text-[#22C58B] font-semibold';
                        } else if (isPicked && !isRightOption) {
                          optionStyle =
                            'border-[#F2545B] bg-[#F2545B]/15 text-[#a91e24] dark:text-[#F2545B]';
                        } else {
                          optionStyle =
                            'border-[#22223B]/10 dark:border-white/10 opacity-65';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={picked !== undefined}
                          onClick={() => handleOptionPick(q, idx)}
                          className={`min-h-[44px] px-4 py-2.5 rounded-xl border text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer disabled:cursor-default ${optionStyle}`}
                        >
                          <span>
                            <strong className="font-score mr-2">{String.fromCharCode(65 + idx)}.</strong>
                            {opt}
                          </span>
                          {picked !== undefined && isRightOption && (
                            <CheckCircle2 className="w-4 h-4 text-[#22C58B] shrink-0" />
                          )}
                          {picked !== undefined && isPicked && !isRightOption && (
                            <XCircle className="w-4 h-4 text-[#F2545B] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Microcopy Feedback + Show Solution Toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="text-sm font-semibold">
                      {picked !== undefined && (
                        picked === q.correctIndex ? (
                          <span className="text-[#158058] dark:text-[#22C58B]">
                            {t.microcopy.correct} (+20 XP)
                          </span>
                        ) : (
                          <span className="text-[#c8232a] dark:text-[#F2545B]">
                            {t.microcopy.wrong}
                          </span>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenSolutions((prev) => ({ ...prev, [q.id]: !showSol }))}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B2FBF] dark:text-[#FFC83D] hover:underline cursor-pointer"
                    >
                      {showSol ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showSol ? 'Hide Solution' : 'Show Solution'}</span>
                    </button>
                  </div>

                  {showSol && (
                    <div className="rounded-xl bg-[#3B2FBF]/5 dark:bg-white/5 border border-[#3B2FBF]/15 dark:border-white/10 p-4 text-sm text-[#22223B]/85 dark:text-white/85 leading-relaxed">
                      <div className="text-xs font-bold text-[#3B2FBF] dark:text-[#FFC83D] mb-1">
                        Step-by-Step Solution · Answer {String.fromCharCode(65 + q.correctIndex)}
                      </div>
                      {localized.explanation}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
