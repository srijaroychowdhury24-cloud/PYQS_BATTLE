import React, { useState } from 'react';
import { Award, Flame, Shield, Snowflake, Trophy, Users } from 'lucide-react';
import { ExamId, LeaderboardEntry, UserProfile } from '../types';
import { EXAM_CATALOG, getRankFromXp, RANK_THRESHOLDS } from '../data/translations';
import { BADGE_CATALOG } from '../data/pyqDatabase';
import { StudentAvatar, TigerMascot } from './MascotAndVisuals';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  profile: UserProfile;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ entries, profile }) => {
  const [tab, setTab] = useState<'weekly' | 'alltime' | 'city' | 'school'>('weekly');
  const [friendsOnly, setFriendsOnly] = useState(false);

  const userRow: LeaderboardEntry = {
    id: 'user-self',
    name: profile.name.trim() ? `${profile.name.trim()} (You)` : 'You (Set Name in Profile)',
    city: profile.city.trim() || 'India',
    school: profile.schoolOrCollege.trim() || 'Independent Aspirant',
    avatarId: profile.avatarId,
    xp: profile.xp,
    weeklyXp: profile.xp,
    winRate: 0,
    streak: profile.streakDays,
    isFriend: true,
  };

  const combined = [...entries, userRow]
    .filter((e) => (!friendsOnly || e.isFriend))
    .filter((e) => (tab === 'city' && profile.city.trim() ? e.city.toLowerCase() === profile.city.trim().toLowerCase() : true))
    .sort((a, b) => (tab === 'weekly' ? b.weeklyXp - a.weeklyXp : b.xp - a.xp));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#22223B] dark:text-white flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-[#FFC83D]" />
            <span>Arena Leaderboard</span>
          </h1>
          <p className="text-sm text-[#22223B]/75 dark:text-white/75 mt-1">
            Compete weekly across your school, city, and national exam cohorts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFriendsOnly(!friendsOnly)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
            friendsOnly
              ? 'bg-[#3B2FBF] border-[#3B2FBF] text-white'
              : 'bg-white dark:bg-[#1A1740] border-[#22223B]/15 dark:border-white/15'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{friendsOnly ? 'Showing Friends' : 'Filter: Friends'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-white dark:bg-[#1A1740] border border-[#22223B]/10 dark:border-white/10">
        {(
          [
            { id: 'weekly', label: 'Weekly' },
            { id: 'alltime', label: 'All-Time' },
            { id: 'city', label: `City (${profile.city})` },
            { id: 'school', label: 'School / College' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              tab === item.id
                ? 'bg-[#FF7A1A] text-white'
                : 'text-[#22223B]/75 dark:text-white/75 hover:text-[#3B2FBF]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#22223B]/10 dark:border-white/10 text-xs text-[#22223B]/65 dark:text-white/65">
              <th className="py-3.5 px-4 font-semibold">Rank</th>
              <th className="py-3.5 px-4 font-semibold">Competitor</th>
              <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Tier</th>
              <th className="py-3.5 px-4 font-semibold text-right">Win %</th>
              <th className="py-3.5 px-4 font-semibold text-right">Streak</th>
              <th className="py-3.5 px-4 font-semibold text-right">
                {tab === 'weekly' ? 'Weekly XP' : 'Total XP'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22223B]/10 dark:divide-white/10">
            {combined.map((row, idx) => {
              const isSelf = row.id === 'user-self';
              const tier = getRankFromXp(row.xp).tier;
              return (
                <tr
                  key={row.id}
                  className={
                    isSelf
                      ? 'bg-[#3B2FBF]/10 dark:bg-[#FFC83D]/10 font-semibold'
                      : 'hover:bg-[#FFF9F0]/60 dark:hover:bg-white/5'
                  }
                >
                  <td className="py-3.5 px-4 font-score font-bold">#{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <StudentAvatar avatarId={row.avatarId} size={34} />
                      <div>
                        <div className="text-sm font-semibold">{row.name}</div>
                        <div className="text-xs text-[#22223B]/60 dark:text-white/60">
                          {tab === 'school' ? row.school : row.city}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-[#3B2FBF] dark:text-[#FFC83D] hidden sm:table-cell">
                    {tier}
                  </td>
                  <td className="py-3.5 px-4 text-right font-score">{row.winRate}%</td>
                  <td className="py-3.5 px-4 text-right font-score text-[#FF7A1A]">{row.streak}d</td>
                  <td className="py-3.5 px-4 text-right font-score font-bold">
                    {(tab === 'weekly' ? row.weeklyXp : row.xp).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUseStreakFreeze: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onUseStreakFreeze,
}) => {
  const [nameInput, setNameInput] = useState(profile.name);
  const [cityInput, setCityInput] = useState(profile.city);
  const [schoolInput, setSchoolInput] = useState(profile.schoolOrCollege);
  const [nameError, setNameError] = useState('');
  const [savedMsg, setSavedMsg] = useState('');

  const rankInfo = getRankFromXp(profile.xp);
  const avatars = ['avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5', 'avatar-6'];
  const isProfileSetup = profile.name.trim().length > 0;

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setNameError('Please enter your name to view your profile.');
      return;
    }
    setNameError('');
    onUpdateProfile({
      name: nameInput.trim(),
      city: cityInput.trim() || 'India',
      schoolOrCollege: schoolInput.trim() || 'Independent Aspirant',
    });
    setSavedMsg('Profile saved!');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  if (!isProfileSetup) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <form
          onSubmit={handleSaveDetails}
          className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-[#22223B] dark:text-white">
                Create Your Arena Profile
              </h1>
              <p className="text-sm text-[#22223B]/70 dark:text-white/70 mt-1">
                Enter your name to unlock your stats, rank progression, and 30-day streak tracker.
              </p>
            </div>
            <TigerMascot mood="idle" size={68} className="shrink-0" />
          </div>

          <div>
            <label htmlFor="setup-name" className="block text-xs font-bold mb-1.5">
              Your Name *
            </label>
            <input
              id="setup-name"
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="e.g. Riya Sen"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#22223B]/20 dark:border-white/20 bg-[#FFF9F0] dark:bg-[#12102B] text-sm focus:outline-none focus:border-[#3B2FBF] dark:focus:border-[#FFC83D]"
            />
            {nameError && <p className="text-xs font-semibold text-[#F2545B] mt-1.5">{nameError}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="setup-city" className="block text-xs font-semibold mb-1.5">
                City (optional)
              </label>
              <input
                id="setup-city"
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="e.g. Kolkata"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0] dark:bg-[#12102B] text-sm"
              />
            </div>
            <div>
              <label htmlFor="setup-exam" className="block text-xs font-semibold mb-1.5">
                Target Exam
              </label>
              <select
                id="setup-exam"
                value={profile.targetExam}
                onChange={(e) => onUpdateProfile({ targetExam: e.target.value as ExamId })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0] dark:bg-[#12102B] text-sm"
              >
                {EXAM_CATALOG.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#22223B]/70 dark:text-white/70 mb-2">
              Pick Avatar
            </div>
            <div className="flex flex-wrap gap-2.5">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => onUpdateProfile({ avatarId: av })}
                  className={`p-1 rounded-full border-2 cursor-pointer transition-transform ${
                    profile.avatarId === av
                      ? 'border-[#FF7A1A] scale-105'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <StudentAvatar avatarId={av} size={42} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#FF7A1A] hover:bg-[#e5680d] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            View My Profile
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Profile Banner */}
      <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <StudentAvatar avatarId={profile.avatarId} size={76} />
          <div>
            <div className="text-xs font-semibold text-[#FF7A1A]">
              {rankInfo.tier} Tier · {profile.targetExam} Aspirant
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-0.5">
              {profile.name}
            </h1>
            <p className="text-xs text-[#22223B]/70 dark:text-white/70 mt-0.5">
              {profile.city} · {profile.schoolOrCollege}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <TigerMascot mood={profile.streakDays > 0 ? 'cheer' : 'sulk'} size={72} />
          <div className="space-y-1">
            <div className="font-score text-xl font-extrabold text-[#3B2FBF] dark:text-[#FFC83D]">
              {profile.xp.toLocaleString()} XP
            </div>
            <div className="text-xs text-[#22223B]/70 dark:text-white/70">
              {rankInfo.nextTier
                ? `${rankInfo.xpToNext} XP to ${rankInfo.nextTier}`
                : 'Maximum Legend Rank!'}
            </div>
            <div className="w-40 h-2 rounded-full bg-[#22223B]/10 dark:bg-white/10 overflow-hidden">
              <div className="h-full bg-[#FFC83D]" style={{ width: `${rankInfo.progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Rank Ladder */}
      <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5">
        <h2 className="font-display text-base font-bold mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#3B2FBF] dark:text-[#FFC83D]" />
          <span>Arena Rank Progression</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {RANK_THRESHOLDS.map((r) => {
            const reached = profile.xp >= r.minXp;
            return (
              <div
                key={r.tier}
                className={`p-3 rounded-xl border text-center ${
                  reached
                    ? 'border-[#3B2FBF] bg-[#3B2FBF]/10 dark:border-[#FFC83D] dark:bg-[#FFC83D]/10'
                    : 'border-[#22223B]/10 dark:border-white/10 opacity-60'
                }`}
              >
                <div className="text-xs font-bold">{r.tier}</div>
                <div className="font-score text-[11px] text-[#22223B]/70 dark:text-white/70 mt-0.5">
                  {r.minXp}+ XP
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avatar + Account Editor + Streak Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customizer & Profile Details */}
        <form
          onSubmit={handleSaveDetails}
          className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-5"
        >
          <h2 className="font-display text-lg font-bold">Customize Avatar & Profile</h2>

          <div>
            <div className="text-xs font-semibold text-[#22223B]/70 dark:text-white/70 mb-2">
              Choose Arena Avatar
            </div>
            <div className="flex flex-wrap gap-2.5">
              {avatars.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => onUpdateProfile({ avatarId: av })}
                  className={`p-1 rounded-full border-2 cursor-pointer transition-transform ${
                    profile.avatarId === av
                      ? 'border-[#FF7A1A] scale-105'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <StudentAvatar avatarId={av} size={44} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-semibold mb-1">
                Student Name
              </label>
              <input
                id="profile-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0] dark:bg-[#12102B] text-sm"
              />
            </div>
            <div>
              <label htmlFor="profile-city" className="block text-xs font-semibold mb-1">
                City
              </label>
              <input
                id="profile-city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0] dark:bg-[#12102B] text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="target-exam" className="block text-xs font-semibold mb-1">
              Primary Target Exam
            </label>
            <select
              id="target-exam"
              value={profile.targetExam}
              onChange={(e) => onUpdateProfile({ targetExam: e.target.value as ExamId })}
              className="w-full px-3 py-2 rounded-xl border border-[#22223B]/15 dark:border-white/15 bg-[#FFF9F0] dark:bg-[#12102B] text-sm"
            >
              {EXAM_CATALOG.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.yearsCovered})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#3B2FBF] text-white text-xs font-semibold cursor-pointer"
            >
              Save Profile
            </button>
            {savedMsg && <span className="text-xs font-semibold text-[#22C58B]">{savedMsg}</span>}
          </div>
        </form>

        {/* Streak Calendar & Freeze */}
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FF7A1A]" />
              <span>30-Day Study Streak</span>
            </h2>
            <span className="font-score text-sm font-bold text-[#FF7A1A]">
              {profile.streakDays} Days Active
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1.5">
            {profile.activityCalendar.map((active, i) => (
              <div
                key={i}
                title={`Day ${i + 1}: ${active ? 'Practiced' : 'Missed'}`}
                className={`h-7 rounded-md flex items-center justify-center font-score text-[10px] ${
                  active
                    ? 'bg-[#22C58B] text-[#12102B] font-bold'
                    : 'bg-[#22223B]/10 dark:bg-white/10 text-[#22223B]/50 dark:text-white/50'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#22223B]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#22223B]/75 dark:text-white/75 flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-[#3B2FBF] dark:text-[#FFC83D]" />
              <span>
                Streak Freeze Tokens: <strong className="font-score">{profile.streakFreezes}</strong>
              </span>
            </div>
            <button
              type="button"
              disabled={profile.streakFreezes <= 0}
              onClick={onUseStreakFreeze}
              className="px-3.5 py-2 rounded-xl border border-[#3B2FBF]/30 dark:border-[#FFC83D]/40 text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Apply Streak Freeze (+1d)
            </button>
          </div>
        </div>
      </div>

      {/* Earned Badges & Battle History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FFC83D]" />
            <span>Arena Badges</span>
          </h2>
          <div className="space-y-2.5">
            {BADGE_CATALOG.map((badge) => {
              const unlocked = profile.unlockedBadges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    unlocked
                      ? 'border-[#FFC83D] bg-[#FFC83D]/10'
                      : 'border-[#22223B]/10 dark:border-white/10 opacity-60'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{badge.title}</div>
                    <div className="text-xs text-[#22223B]/70 dark:text-white/70">{badge.desc}</div>
                  </div>
                  <span className="font-score text-xs font-bold whitespace-nowrap">
                    {unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#22223B]/10 dark:border-white/10 bg-white dark:bg-[#1A1740] p-6 space-y-4">
          <h2 className="font-display text-lg font-bold">Recent Battle History</h2>
          {profile.battleHistory.length === 0 ? (
            <p className="text-sm text-[#22223B]/65 dark:text-white/65 py-4">
              No battles played yet. Enter the Battle Lobby to record your first match!
            </p>
          ) : (
            <div className="divide-y divide-[#22223B]/10 dark:divide-white/10">
              {profile.battleHistory.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="font-semibold">
                      {item.mode} · {item.exam} vs {item.opponentName}
                    </div>
                    <div className="text-xs text-[#22223B]/60 dark:text-white/60">
                      {item.date} · Score {item.userScore}–{item.opponentScore}
                    </div>
                  </div>
                  <div className="text-right font-score text-xs font-bold">
                    <div className={item.won ? 'text-[#22C58B]' : 'text-[#F2545B]'}>
                      {item.won ? 'WON' : 'LOST'}
                    </div>
                    <div className="text-[#3B2FBF] dark:text-[#FFC83D]">+{item.xpEarned} XP</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
