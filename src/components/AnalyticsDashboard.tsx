import React from 'react';
import { ArrowRight, Flame, Target, Timer, TrendingUp } from 'lucide-react';
import { UserProfile } from '../types';

interface AnalyticsDashboardProps {
  profile: UserProfile;
  onStartTopicDrill: (topic: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  profile,
  onStartTopicDrill,
}) => {
  const solvedCount = profile.solvedIds.length;
  const correctCount = profile.correctIds.length;
  const accuracy = solvedCount === 0 ? 0 : Math.round((correctCount / solvedCount) * 100);
  const avgTimeSec =
    profile.mockAttempts.length > 0
      ? Math.round(
          profile.mockAttempts.reduce((acc, m) => acc + m.avgTimeSec, 0) /
            profile.mockAttempts.length
        )
      : 0;

  const topicHeatmap = [
    { topic: 'Complex Numbers', subject: 'Mathematics', accuracy: 88, level: 'Strong' },
    { topic: 'Molecular Genetics', subject: 'Biology', accuracy: 84, level: 'Strong' },
    { topic: 'Indian Polity', subject: 'General Studies', accuracy: 78, level: 'Strong' },
    { topic: 'Algorithms & Complexity', subject: 'Computer Science', accuracy: 71, level: 'Developing' },
    { topic: 'Electrochemistry', subject: 'Chemistry', accuracy: 62, level: 'Developing' },
    { topic: 'Thermodynamics', subject: 'Physics', accuracy: 44, level: 'Weak' },
  ];

  const trendPoints = [62, 66, 65, 71, 74, 79, accuracy];
  const polylinePts = trendPoints
    .map((val, idx) => {
      const x = 24 + idx * 54;
      const y = 140 - (val / 100) * 110;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-[#22223B] dark:text-white">
          Performance Analytics
        </h1>
        <p className="text-sm text-[#22223B]/75 dark:text-white/75 mt-1">
          Track accuracy trends, chapter mastery, and how you stack up against your city peers.
        </p>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-[#22C58B]' },
          { label: 'Avg Time / Question', value: `${avgTimeSec}s`, icon: Timer, color: 'text-[#3B2FBF] dark:text-[#FFC83D]' },
          { label: 'PYQs Solved', value: `${solvedCount}`, icon: TrendingUp, color: 'text-[#FF7A1A]' },
          { label: 'Active Streak', value: `${profile.streakDays} days`, icon: Flame, color: 'text-[#FF7A1A]' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5"
            >
              <div className="flex items-center justify-between text-xs text-[#22223B]/65 dark:text-white/65">
                <span>{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className={`font-score text-2xl font-extrabold mt-2 ${kpi.color}`}>
                {kpi.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Actionable Suggestion Card */}
      <div className="rounded-2xl bg-[#3B2FBF] text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#FFC83D]">Smart Study Suggestion</div>
          <h2 className="font-display text-xl font-bold mt-1">
            You lose most marks in Thermodynamics (44% accuracy). Start a 10-minute PYQ drill?
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onStartTopicDrill('Thermodynamics')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF7A1A] hover:bg-[#e5680d] text-white text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Start Thermodynamics Drill</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Charts Row: Score Trend + City Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Trend SVG */}
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">7-Session Accuracy Trend</h3>
            <span className="font-score text-xs font-semibold text-[#22C58B]">+14% vs last week</span>
          </div>

          <svg viewBox="0 0 380 160" className="w-full h-44" aria-label="Accuracy trend line chart">
            {[40, 60, 80, 100].map((mark) => {
              const y = 140 - (mark / 100) * 110;
              return (
                <g key={mark}>
                  <line x1="20" y1={y} x2="365" y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
                  <text x="0" y={y + 4} fontSize="9" fill="currentColor" fillOpacity="0.55">
                    {mark}%
                  </text>
                </g>
              );
            })}
            <polyline
              fill="none"
              stroke="#3B2FBF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={polylinePts}
            />
            {trendPoints.map((val, idx) => {
              const x = 24 + idx * 54;
              const y = 140 - (val / 100) * 110;
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="4.5" fill="#FF7A1A" />
                  <text x={x} y="156" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.6">
                    S{idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* City / Peer Comparison */}
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-4">
          <h3 className="font-display text-lg font-bold">Peer Benchmark ({profile.city.trim() || 'India'})</h3>
          <p className="text-xs text-[#22223B]/70 dark:text-white/70">
            Comparing your accuracy and speed against {profile.city.trim() || 'India'} aspirants targeting {profile.targetExam}.
          </p>

          <div className="space-y-4 pt-2">
            {[
              { label: 'Your Accuracy', pct: accuracy, color: 'bg-[#3B2FBF]' },
              { label: `${profile.city.trim() || 'India'} Average`, pct: 64, color: 'bg-[#FF7A1A]' },
              { label: 'Top 10% Cohort', pct: 86, color: 'bg-[#22C58B]' },
            ].map((bar) => (
              <div key={bar.label} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{bar.label}</span>
                  <span className="font-score">{bar.pct}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-[#22223B]/10 dark:bg-white/10 overflow-hidden">
                  <div className={`h-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Heatmap */}
      <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-bold">Topic Mastery Heatmap</h3>
          <span className="text-xs text-[#22223B]/65 dark:text-white/65">
            Click any topic to practice targeted PYQs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topicHeatmap.map((item) => {
            const tone =
              item.level === 'Strong'
                ? 'border-[#22C58B]/40 bg-[#22C58B]/10 text-[#158058] dark:text-[#22C58B]'
                : item.level === 'Developing'
                  ? 'border-[#FFC83D]/50 bg-[#FFC83D]/15 text-[#9a6b00] dark:text-[#FFC83D]'
                  : 'border-[#F2545B]/45 bg-[#F2545B]/12 text-[#b91c24] dark:text-[#F2545B]';

            return (
              <button
                key={item.topic}
                type="button"
                onClick={() => onStartTopicDrill(item.topic)}
                className={`rounded-xl border p-4 text-left transition-transform hover:-translate-y-0.5 cursor-pointer ${tone}`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>{item.subject}</span>
                  <span className="font-score">{item.level} · {item.accuracy}%</span>
                </div>
                <div className="font-display text-base font-bold mt-1 text-[#22223B] dark:text-white">
                  {item.topic}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
