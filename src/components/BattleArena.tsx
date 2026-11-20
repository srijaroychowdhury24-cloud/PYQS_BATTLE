import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  RotateCcw,
  Swords,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { BattleHistoryItem, ExamId, Language, PYQQuestion } from '../types';
import { EXAM_CATALOG, UI_TEXT } from '../data/translations';
import { INITIAL_LEADERBOARD, PYQ_BANK } from '../data/pyqDatabase';
import { MascotMood, StudentAvatar, TigerMascot } from './MascotAndVisuals';
import { playCorrectSound, playVictorySound, playWrongSound } from '../utils/soundEffects';

interface BattleArenaProps {
  language: Language;
  userName: string;
  userAvatarId: string;
  soundEnabled: boolean;
  onTriggerConfetti: (intensity?: 'normal' | 'victory') => void;
  onBattleComplete: (record: BattleHistoryItem, unlockedFastBadge: boolean, zeroMistakes: boolean) => void;
}

type BattlePhase = 'lobby' | 'matching' | 'live' | 'result';
type BattleMode = '1v1 Duel' | 'Squad Battle' | 'Daily Tournament' | 'Friend Challenge';

export const BattleArena: React.FC<BattleArenaProps> = ({
  language,
  userName,
  userAvatarId,
  soundEnabled,
  onTriggerConfetti,
  onBattleComplete,
}) => {
  const [phase, setPhase] = useState<BattlePhase>('lobby');
  const [mode, setMode] = useState<BattleMode>('1v1 Duel');
  const [examFilter, setExamFilter] = useState<ExamId | 'MIXED'>('MIXED');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 15>(5);
  const [secondsPerQ, setSecondsPerQ] = useState<15 | 20 | 30>(20);
  const [inviteCode] = useState(() => `PYQ-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const [deck, setDeck] = useState<PYQQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [userScore, setUserScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [answersLog, setAnswersLog] = useState<{ q: PYQQuestion; picked: number | null; timeUsed: number }[]>([]);
  const [mascotMood, setMascotMood] = useState<MascotMood>('battle');
  const [reviewOpen, setReviewOpen] = useState(false);

  const t = UI_TEXT[language];
  const rival = useMemo(() => INITIAL_LEADERBOARD[0], []);

  const buildDeck = (): PYQQuestion[] => {
    const pool =
      examFilter === 'MIXED'
        ? PYQ_BANK
        : PYQ_BANK.filter((q) => q.exam === examFilter);
    const source = pool.length >= questionCount ? pool : [...pool, ...PYQ_BANK];
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  };

  const startMatchmaking = () => {
    const nextDeck = buildDeck();
    setDeck(nextDeck);
    setCurrentIdx(0);
    setUserScore(0);
    setRivalScore(0);
    setPickedOption(null);
    setAnswersLog([]);
    setReviewOpen(false);
    setMascotMood('battle');
    setPhase('matching');
  };

  useEffect(() => {
    if (phase !== 'matching') return;
    const timer = setTimeout(() => {
      setTimeLeft(secondsPerQ);
      setPhase('live');
    }, 1400);
    return () => clearTimeout(timer);
  }, [phase, secondsPerQ]);

  useEffect(() => {
    if (phase !== 'live' || pickedOption !== null) return;
    if (timeLeft <= 0) {
      handleRoundFinish(null);
      return;
    }
    const id = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(id);
  });

  const handleRoundFinish = (choice: number | null) => {
    if (pickedOption !== null) return;
    const currentQ = deck[currentIdx];
    setPickedOption(choice === null ? -1 : choice);
    const timeUsed = secondsPerQ - timeLeft;
    const isCorrect = choice !== null && choice === currentQ.correctIndex;

    let addedUser = 0;
    if (isCorrect) {
      addedUser = 30 + Math.max(5, timeLeft);
      setUserScore((s) => s + addedUser);
      setMascotMood('cheer');
      playCorrectSound(soundEnabled);
      onTriggerConfetti('normal');
    } else {
      setMascotMood('sulk');
      playWrongSound(soundEnabled);
    }

    // Rival simulated answer (balanced competitive feel)
    const rivalCorrect = Math.random() < 0.68;
    const addedRival = rivalCorrect ? 28 + Math.floor(Math.random() * 14) : 0;
    setRivalScore((s) => s + addedRival);

    const updatedLog = [...answersLog, { q: currentQ, picked: choice, timeUsed }];
    setAnswersLog(updatedLog);

    setTimeout(() => {
      if (currentIdx + 1 < deck.length) {
        setCurrentIdx((i) => i + 1);
        setPickedOption(null);
        setTimeLeft(secondsPerQ);
        setMascotMood('battle');
      } else {
        const finalUser = userScore + addedUser;
        const finalRival = rivalScore + addedRival;
        const won = finalUser >= finalRival;
        const xpEarned = won ? 95 : 40;
        const fastAnswer = updatedLog.some((l) => l.picked === l.q.correctIndex && l.timeUsed <= 4);
        const zeroMistakes = updatedLog.every((l) => l.picked === l.q.correctIndex);

        setMascotMood(won ? 'cheer' : 'sulk');
        if (won) {
          playVictorySound(soundEnabled);
          onTriggerConfetti('victory');
        }
        setPhase('result');
        onBattleComplete(
          {
            id: `battle-${Date.now()}`,
            date: 'Just now',
            mode,
            exam: examFilter === 'MIXED' ? 'JEE' : examFilter,
            opponentName: mode === 'Squad Battle' ? `${rival.name} +2` : rival.name,
            userScore: finalUser,
            opponentScore: finalRival,
            won,
            xpEarned,
          },
          fastAnswer,
          zeroMistakes
        );
      }
    }, 950);
  };

  const copyInvite = () => {
    navigator.clipboard?.writeText(`Join my PYQ Battle room ${inviteCode}!`);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  // Circular countdown SVG
  const r = 24;
  const c = 2 * Math.PI * r;
  const pct = timeLeft / secondsPerQ;
  const timerOffset = c * (1 - pct);

  if (phase === 'lobby') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-[#22223B] dark:text-white">
              Battle Lobby
            </h1>
            <p className="text-sm text-[#22223B]/75 dark:text-white/75">
              Pick a mode, choose your 10-year exam pool, and race the clock.
            </p>
          </div>
          <TigerMascot mood="battle" size={80} />
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(
            [
              { id: '1v1 Duel', desc: 'Head-to-head live duel', icon: Swords },
              { id: 'Squad Battle', desc: '4-player arena race', icon: Users },
              { id: 'Daily Tournament', desc: 'Ranked mixed PYQs', icon: Trophy },
              { id: 'Friend Challenge', desc: 'Invite via room code', icon: Copy },
            ] as const
          ).map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`rounded-2xl border p-4 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-[#FF7A1A] bg-[#FF7A1A]/10'
                    : 'border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] hover:border-[#3B2FBF]/40'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#FF7A1A]' : 'text-[#3B2FBF] dark:text-[#FFC83D]'}`} />
                <div className="font-display text-base font-bold mt-2">{m.id}</div>
                <div className="text-xs text-[#22223B]/70 dark:text-white/70 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Settings Card */}
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#22223B]/70 dark:text-white/70 mb-2">
              Exam Arena Pool
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setExamFilter('MIXED')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                  examFilter === 'MIXED'
                    ? 'bg-[#3B2FBF] text-white'
                    : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/80 dark:text-white/80'
                }`}
              >
                All-India Mixed
              </button>
              {EXAM_CATALOG.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setExamFilter(ex.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                    examFilter === ex.id
                      ? 'bg-[#3B2FBF] text-white'
                      : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/80 dark:text-white/80'
                  }`}
                >
                  {ex.id}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#22223B]/70 dark:text-white/70 mb-2">
                Questions per Match
              </label>
              <div className="flex gap-2">
                {([5, 10, 15] as const).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setQuestionCount(cnt)}
                    className={`flex-1 py-2.5 rounded-xl font-score text-sm font-bold cursor-pointer ${
                      questionCount === cnt
                        ? 'bg-[#FF7A1A] text-white'
                        : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/80 dark:text-white/80'
                    }`}
                  >
                    {cnt} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#22223B]/70 dark:text-white/70 mb-2">
                Timer per Question
              </label>
              <div className="flex gap-2">
                {([15, 20, 30] as const).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSecondsPerQ(sec)}
                    className={`flex-1 py-2.5 rounded-xl font-score text-sm font-bold cursor-pointer ${
                      secondsPerQ === sec
                        ? 'bg-[#3B2FBF] text-white'
                        : 'bg-[#FFF9F0] dark:bg-[#12102B] text-[#22223B]/80 dark:text-white/80'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {mode === 'Friend Challenge' && (
            <div className="rounded-xl bg-[#FFF9F0] dark:bg-[#12102B] border border-[#22223B]/10 dark:border-white/10 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[#22223B]/65 dark:text-white/65">Private Room Code</div>
                <div className="font-score text-lg font-bold text-[#3B2FBF] dark:text-[#FFC83D]">
                  {inviteCode}
                </div>
              </div>
              <button
                type="button"
                onClick={copyInvite}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3B2FBF] text-white text-xs font-semibold cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedInvite ? 'Copied!' : 'Copy Invite Link'}</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={startMatchmaking}
            className="w-full py-3.5 rounded-xl bg-[#FF7A1A] hover:bg-[#e5680d] text-white font-display text-lg font-bold transition-colors cursor-pointer"
          >
            Find Rival & Start {mode}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'matching') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <TigerMascot mood="cheer" size={128} className="mx-auto" />
        <h2 className="font-display text-2xl font-extrabold">{t.microcopy.loading}</h2>
        <p className="text-sm text-[#22223B]/75 dark:text-white/75">
          Matching you with {rival.name} ({rival.city}) for {questionCount} {examFilter} PYQs…
        </p>
      </div>
    );
  }

  if (phase === 'live' && deck[currentIdx]) {
    const q = deck[currentIdx];
    const localized = q.content[language];
    const isDangerTime = timeLeft <= 5;

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Duel Scoreboard */}
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StudentAvatar avatarId={userAvatarId} size={44} />
            <div>
              <div className="text-sm font-bold">{userName.trim() || 'Challenger'}</div>
              <div className="font-score text-lg font-extrabold text-[#3B2FBF] dark:text-[#FFC83D]">
                {userScore} pts
              </div>
            </div>
          </div>

          {/* Circular Countdown Timer */}
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r={r} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="5" />
                <circle
                  cx="30"
                  cy="30"
                  r={r}
                  fill="none"
                  stroke={isDangerTime ? '#F2545B' : '#3B2FBF'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={c}
                  strokeDashoffset={timerOffset}
                />
              </svg>
              <span
                className={`absolute font-score text-sm font-extrabold ${
                  isDangerTime ? 'text-[#F2545B]' : 'text-[#22223B] dark:text-white'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
            <span className="font-score text-[11px] text-[#22223B]/60 dark:text-white/60 mt-1">
              Q {currentIdx + 1}/{deck.length}
            </span>
          </div>

          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-sm font-bold">{rival.name.split(' ')[0]}</div>
              <div className="font-score text-lg font-extrabold text-[#FF7A1A]">
                {rivalScore} pts
              </div>
            </div>
            <StudentAvatar avatarId={rival.avatarId} size={44} />
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-5 ${
            pickedOption !== null && pickedOption !== q.correctIndex ? 'animate-shake' : ''
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#22223B]/65 dark:text-white/65">
            <span>
              {q.exam} · {q.year} · {q.subject}
            </span>
            <TigerMascot mood={mascotMood} size={44} />
          </div>

          <h2 className="text-lg sm:text-xl font-semibold leading-relaxed text-[#22223B] dark:text-white">
            {localized.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {localized.options.map((opt, idx) => {
              const isPicked = pickedOption === idx;
              const isRight = idx === q.correctIndex;
              let cls =
                'border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0]/60 dark:bg-[#12102B] hover:border-[#3B2FBF]';
              if (pickedOption !== null) {
                if (isRight) cls = 'border-[#22C58B] bg-[#22C58B]/15 font-semibold';
                else if (isPicked) cls = 'border-[#F2545B] bg-[#F2545B]/15';
                else cls = 'border-[#22223B]/10 dark:border-white/10 opacity-60';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={pickedOption !== null}
                  onClick={() => handleRoundFinish(idx)}
                  className={`min-h-[48px] px-4 py-3 rounded-xl border text-left text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${cls}`}
                >
                  <span>
                    <strong className="font-score mr-2">{String.fromCharCode(65 + idx)}.</strong>
                    {opt}
                  </span>
                  {pickedOption !== null && isRight && <CheckCircle2 className="w-4 h-4 text-[#22C58B] shrink-0" />}
                  {pickedOption !== null && isPicked && !isRight && <XCircle className="w-4 h-4 text-[#F2545B] shrink-0" />}
                </button>
              );
            })}
          </div>

          {pickedOption !== null && (
            <div className="text-sm font-bold pt-1">
              {pickedOption === q.correctIndex ? (
                <span className="text-[#158058] dark:text-[#22C58B]">{t.microcopy.correct}</span>
              ) : (
                <span className="text-[#c8232a] dark:text-[#F2545B]">{t.microcopy.wrong}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  const won = userScore >= rivalScore;
  const correctCount = answersLog.filter((l) => l.picked === l.q.correctIndex).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-8 text-center space-y-5">
        <TigerMascot mood={won ? 'cheer' : 'sulk'} size={112} className="mx-auto" />
        <div className="font-score text-sm font-bold text-[#FF7A1A]">
          {won ? 'VICTORY · ARENA WINNER' : 'GOOD FIGHT · KEEP TRAINING'}
        </div>
        <h2 className="font-display text-3xl font-extrabold">
          {won ? `${userName.trim() || 'Challenger'} takes the duel!` : `${rival.name.split(' ')[0]} edged ahead`}
        </h2>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2 border-t border-[#22223B]/10 dark:border-white/10">
          <div>
            <div className="font-score text-2xl font-bold text-[#3B2FBF] dark:text-[#FFC83D]">{userScore}</div>
            <div className="text-xs text-[#22223B]/65 dark:text-white/65">Your Score</div>
          </div>
          <div>
            <div className="font-score text-2xl font-bold text-[#22C58B]">+{won ? 95 : 40}</div>
            <div className="text-xs text-[#22223B]/65 dark:text-white/65">XP Earned</div>
          </div>
          <div>
            <div className="font-score text-2xl font-bold">
              {correctCount}/{deck.length}
            </div>
            <div className="text-xs text-[#22223B]/65 dark:text-white/65">Accuracy</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={startMatchmaking}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#e5680d] text-white text-sm font-semibold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch</span>
          </button>
          <button
            type="button"
            onClick={() => setReviewOpen(!reviewOpen)}
            className="px-5 py-2.5 rounded-xl border border-[#22223B]/20 dark:border-white/20 text-sm font-semibold cursor-pointer"
          >
            {reviewOpen ? 'Hide Mistakes' : 'Review Questions'}
          </button>
          <button
            type="button"
            onClick={() => setPhase('lobby')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#3B2FBF] dark:text-[#FFC83D] cursor-pointer"
          >
            Back to Lobby
          </button>
        </div>
      </div>

      {reviewOpen && (
        <div className="space-y-3">
          {answersLog.map((item, i) => {
            const loc = item.q.content[language];
            const ok = item.picked === item.q.correctIndex;
            return (
              <div
                key={i}
                className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#3B2FBF] dark:text-[#FFC83D]">
                    Q{i + 1} · {item.q.exam} {item.q.year}
                  </span>
                  <span className={ok ? 'text-[#22C58B] font-semibold' : 'text-[#F2545B] font-semibold'}>
                    {ok ? 'Correct' : 'Missed'}
                  </span>
                </div>
                <p className="text-sm font-semibold">{loc.question}</p>
                <p className="text-xs text-[#22223B]/75 dark:text-white/75">
                  Correct Answer: <strong>{loc.options[item.q.correctIndex]}</strong> — {loc.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
