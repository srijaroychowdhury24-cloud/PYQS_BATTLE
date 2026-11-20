import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Flag, Play, RotateCcw } from 'lucide-react';
import { ExamId, Language, MockAttemptRecord, PYQQuestion } from '../types';
import { EXAM_CATALOG } from '../data/translations';
import { PYQ_BANK } from '../data/pyqDatabase';

interface MockTestArenaProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onMockComplete: (record: MockAttemptRecord) => void;
}

interface MockPaperSpec {
  id: string;
  title: string;
  exam: ExamId | 'ALL';
  year: number;
  durationMin: number;
  questions: PYQQuestion[];
}

export const MockTestArena: React.FC<MockTestArenaProps> = ({
  language,
  onLanguageChange,
  onMockComplete,
}) => {
  const [examFilter, setExamFilter] = useState<ExamId | 'ALL'>('ALL');
  const [activePaper, setActivePaper] = useState<MockPaperSpec | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [responses, setResponses] = useState<Record<number, number | undefined>>({});
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const mockPapers: MockPaperSpec[] = useMemo(() => {
    const decadeMixed: MockPaperSpec = {
      id: 'mock-all-decade',
      title: 'All-India 10-Year Mega Sprint (2016–2025)',
      exam: 'ALL',
      year: 2025,
      durationMin: 12,
      questions: PYQ_BANK.slice(0, 10),
    };
    const perExam: MockPaperSpec[] = EXAM_CATALOG.map((ex) => {
      const qs = PYQ_BANK.filter((q) => q.exam === ex.id);
      const padded = qs.length >= 4 ? qs : [...qs, ...PYQ_BANK.slice(0, 4 - qs.length)];
      return {
        id: `mock-${ex.id.toLowerCase()}`,
        title: `${ex.name} Previous Paper Set`,
        exam: ex.id,
        year: padded[0]?.year ?? 2024,
        durationMin: 8,
        questions: padded,
      };
    });
    return [decadeMixed, ...perExam];
  }, []);

  const visiblePapers = mockPapers.filter((p) => examFilter === 'ALL' || p.exam === examFilter);

  useEffect(() => {
    if (!activePaper || submitted) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  });

  const launchPaper = (paper: MockPaperSpec) => {
    setActivePaper(paper);
    setCurrentIdx(0);
    setResponses({});
    setMarked({});
    setSecondsLeft(paper.durationMin * 60);
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!activePaper || submitted) return;
    setSubmitted(true);
    let score = 0;
    let maxScore = 0;
    let correct = 0;
    let attempted = 0;
    activePaper.questions.forEach((q, idx) => {
      maxScore += q.marks;
      const ans = responses[idx];
      if (ans !== undefined) {
        attempted++;
        if (ans === q.correctIndex) {
          score += q.marks;
          correct++;
        } else {
          score -= q.negativeMarks;
        }
      }
    });
    const accuracy = attempted === 0 ? 0 : Math.round((correct / attempted) * 100);
    const totalSpent = activePaper.durationMin * 60 - secondsLeft;
    const avgTimeSec = attempted === 0 ? 0 : Math.round(totalSpent / attempted);
    onMockComplete({
      id: `mock-${Date.now()}`,
      paperTitle: activePaper.title,
      exam: activePaper.exam === 'ALL' ? 'JEE' : activePaper.exam,
      year: activePaper.year,
      score: Math.max(0, Number(score.toFixed(2))),
      maxScore,
      accuracy,
      avgTimeSec,
      date: 'Today',
    });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // TEST LIST VIEW
  if (!activePaper) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-[#22223B] dark:text-white">
              Timed OMR Mock Tests
            </h1>
            <p className="text-sm text-[#22223B]/75 dark:text-white/75 mt-1">
              Real exam-hall interface with color + label question palette and mid-test language toggle.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setExamFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                examFilter === 'ALL' ? 'bg-[#3B2FBF] text-white' : 'bg-white dark:bg-[#1A1740]'
              }`}
            >
              All
            </button>
            {EXAM_CATALOG.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setExamFilter(ex.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  examFilter === ex.id ? 'bg-[#3B2FBF] text-white' : 'bg-white dark:bg-[#1A1740]'
                }`}
              >
                {ex.id}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visiblePapers.map((paper) => (
            <div
              key={paper.id}
              className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#22223B]/65 dark:text-white/65">
                  <span className="font-semibold text-[#3B2FBF] dark:text-[#FFC83D]">
                    {paper.exam === 'ALL' ? 'Multi-Exam' : paper.exam}
                  </span>
                  <span className="font-score">{paper.durationMin} mins · {paper.questions.length} Qs</span>
                </div>
                <h2 className="font-display text-lg font-bold mt-2">{paper.title}</h2>
                <p className="text-xs text-[#22223B]/70 dark:text-white/70 mt-1">
                  Includes authentic negative marking and instant EN / বাং / हिं translation inside the hall.
                </p>
              </div>
              <button
                type="button"
                onClick={() => launchPaper(paper)}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#e5680d] text-white text-sm font-semibold cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>Start Timed Mock</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RESULT SCORECARD VIEW
  if (submitted) {
    let score = 0;
    let maxScore = 0;
    let correct = 0;
    activePaper.questions.forEach((q, idx) => {
      maxScore += q.marks;
      if (responses[idx] !== undefined) {
        if (responses[idx] === q.correctIndex) {
          score += q.marks;
          correct++;
        } else {
          score -= q.negativeMarks;
        }
      }
    });

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-semibold text-[#22C58B]">Mock Submitted</div>
            <h2 className="font-display text-2xl font-extrabold mt-1">{activePaper.title}</h2>
            <p className="text-sm text-[#22223B]/70 dark:text-white/70 mt-1">
              You answered {correct} of {activePaper.questions.length} correctly.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-score text-3xl font-extrabold text-[#3B2FBF] dark:text-[#FFC83D]">
                {Math.max(0, Number(score.toFixed(2)))} / {maxScore}
              </div>
              <div className="text-xs text-[#22223B]/65 dark:text-white/65">Net Marks</div>
            </div>
            <button
              type="button"
              onClick={() => setActivePaper(null)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#3B2FBF] text-white text-sm font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>All Mocks</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {activePaper.questions.map((q, idx) => {
            const loc = q.content[language];
            const ans = responses[idx];
            const isCorrect = ans === q.correctIndex;
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">
                    Q{idx + 1} · {q.exam} {q.year}
                  </span>
                  <span
                    className={
                      ans === undefined
                        ? 'text-[#22223B]/60 dark:text-white/60'
                        : isCorrect
                          ? 'text-[#22C58B] font-semibold'
                          : 'text-[#F2545B] font-semibold'
                    }
                  >
                    {ans === undefined ? 'Unattempted (0)' : isCorrect ? `Correct (+${q.marks})` : `Incorrect (-${q.negativeMarks})`}
                  </span>
                </div>
                <p className="text-sm font-semibold">{loc.question}</p>
                <p className="text-xs text-[#22223B]/75 dark:text-white/75">
                  Answer: <strong>{loc.options[q.correctIndex]}</strong> — {loc.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ACTIVE EXAM HALL VIEW
  const q = activePaper.questions[currentIdx];
  const loc = q.content[language];
  const answeredCount = Object.values(responses).filter((v) => v !== undefined).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const unansweredCount = activePaper.questions.length - answeredCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Top Exam Hall Bar */}
      <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#22223B]/65 dark:text-white/65">{activePaper.title}</div>
          <div className="font-score text-sm font-bold">
            Question {currentIdx + 1} of {activePaper.questions.length} · +{q.marks} / -{q.negativeMarks}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Intra-test language switcher */}
          <div className="inline-flex rounded-lg border border-[#22223B]/15 dark:border-white/15 p-0.5">
            {(['en', 'bn', 'hi'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onLanguageChange(code)}
                className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  language === code ? 'bg-[#3B2FBF] text-white' : ''
                }`}
              >
                {code === 'en' ? 'EN' : code === 'bn' ? 'বাং' : 'हिं'}
              </button>
            ))}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 font-score text-base font-bold px-3 py-1.5 rounded-lg ${
              secondsLeft <= 60 ? 'bg-[#F2545B]/15 text-[#F2545B]' : 'bg-[#3B2FBF]/10 text-[#3B2FBF] dark:text-[#FFC83D]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl bg-[#22C58B] text-[#12102B] text-xs font-bold hover:opacity-90 cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Question + Right Question Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-5">
          <div className="text-xs text-[#22223B]/65 dark:text-white/65">
            {q.exam} · {q.year} · {q.subject} · {q.topic}
          </div>

          <h2 className="text-lg font-semibold leading-relaxed">{loc.question}</h2>

          <div className="space-y-2.5">
            {loc.options.map((opt, idx) => {
              const selected = responses[currentIdx] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setResponses((prev) => ({ ...prev, [currentIdx]: idx }))}
                  className={`w-full min-h-[46px] px-4 py-3 rounded-xl border text-left text-sm transition-colors cursor-pointer ${
                    selected
                      ? 'border-[#3B2FBF] bg-[#3B2FBF]/10 font-semibold dark:border-[#FFC83D] dark:bg-[#FFC83D]/15'
                      : 'border-[#22223B]/15 dark:border-white/15 hover:border-[#3B2FBF]/50'
                  }`}
                >
                  <strong className="font-score mr-2">{String.fromCharCode(65 + idx)}.</strong>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#22223B]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setResponses((prev) => ({ ...prev, [currentIdx]: undefined }))}
                className="px-3.5 py-2 rounded-xl border border-[#22223B]/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
              >
                Clear Response
              </button>
              <button
                type="button"
                onClick={() => {
                  setMarked((prev) => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
                  if (currentIdx + 1 < activePaper.questions.length) {
                    setCurrentIdx((i) => i + 1);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#FFC83D] text-xs font-semibold cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-[#FFC83D]" />
                <span>{marked[currentIdx] ? 'Unmark Review' : 'Mark & Next'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-xl border border-[#22223B]/15 dark:border-white/15 text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  if (currentIdx + 1 < activePaper.questions.length) {
                    setCurrentIdx((i) => i + 1);
                  } else {
                    handleSubmit();
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#FF7A1A] text-white text-xs font-semibold cursor-pointer"
              >
                {currentIdx + 1 < activePaper.questions.length ? 'Save & Next' : 'Finish & Submit'}
              </button>
            </div>
          </div>
        </div>

        {/* Right OMR Question Palette */}
        <aside className="lg:col-span-4 rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 space-y-4">
          <h3 className="font-display text-base font-bold">OMR Question Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {activePaper.questions.map((_, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = responses[idx] !== undefined;
              const isMarked = marked[idx];

              let style = 'bg-[#FFF9F0] dark:bg-[#12102B] border-[#22223B]/15 dark:border-white/15';
              if (isMarked) {
                style = 'bg-[#FFC83D]/25 border-[#FFC83D] font-bold';
              } else if (isAnswered) {
                style = 'bg-[#22C58B]/20 border-[#22C58B] font-bold';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-10 rounded-lg border font-score text-xs cursor-pointer ${style} ${
                    isCurrent ? 'ring-2 ring-[#3B2FBF] dark:ring-white' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#22223B]/10 dark:border-white/10 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#158058] dark:text-[#22C58B] font-semibold">Answered</span>
              <span className="font-score font-bold">{answeredCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#b4860b] dark:text-[#FFC83D] font-semibold">Marked for Review</span>
              <span className="font-score font-bold">{markedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#22223B]/70 dark:text-white/70 font-semibold">Unanswered</span>
              <span className="font-score font-bold">{unansweredCount}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
