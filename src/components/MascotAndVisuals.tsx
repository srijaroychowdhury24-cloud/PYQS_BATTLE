import React from 'react';

export type MascotMood = 'idle' | 'cheer' | 'sulk' | 'battle';

export const TigerMascot: React.FC<{
  mood?: MascotMood;
  size?: number;
  className?: string;
}> = ({ mood = 'idle', size = 120, className = '' }) => {
  const isCheering = mood === 'cheer';
  const isSulking = mood === 'sulk';
  const isBattle = mood === 'battle';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${isCheering ? 'animate-bob' : ''} ${className}`}
      aria-label="Sheru the PYQ Battle Tiger Mascot"
    >
      {/* Subtle Arena Aura */}
      <circle
        cx="80"
        cy="86"
        r="62"
        fill={isSulking ? '#F2545B' : '#3B2FBF'}
        fillOpacity="0.10"
      />

      {/* Pencil Sword held in paw */}
      <g
        transform={
          isCheering
            ? 'rotate(-24 122 86) translate(4, -10)'
            : isBattle
              ? 'rotate(12 122 86)'
              : isSulking
                ? 'rotate(38 122 104) translate(0, 12)'
                : 'rotate(-8 122 92)'
        }
      >
        {/* Pencil body */}
        <rect x="116" y="34" width="12" height="58" rx="3" fill="#FFC83D" stroke="#22223B" strokeWidth="2.5" />
        {/* Guard (indigo sword hilt) */}
        <rect x="108" y="88" width="28" height="7" rx="3.5" fill="#3B2FBF" stroke="#22223B" strokeWidth="2.5" />
        {/* Grip & eraser */}
        <rect x="118" y="95" width="8" height="12" rx="2" fill="#FF7A1A" stroke="#22223B" strokeWidth="2.5" />
        {/* Wood tip */}
        <polygon points="116,34 128,34 122,19" fill="#FDE6C4" stroke="#22223B" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Graphite point */}
        <polygon points="120,24 124,24 122,19" fill="#22223B" />
      </g>

      {/* Ears */}
      <circle cx="44" cy="46" r="14" fill="#FF8C32" stroke="#22223B" strokeWidth="3" />
      <circle cx="44" cy="46" r="7" fill="#FFE0B5" />
      <circle cx="116" cy="46" r="14" fill="#FF8C32" stroke="#22223B" strokeWidth="3" />
      <circle cx="116" cy="46" r="7" fill="#FFE0B5" />

      {/* Body */}
      <path
        d="M48 112 C48 92, 112 92, 112 112 L116 142 C116 146, 112 148, 108 148 L52 148 C48 148, 44 146, 44 142 Z"
        fill="#FF7A1A"
        stroke="#22223B"
        strokeWidth="3"
      />
      {/* Cream Belly */}
      <ellipse cx="80" cy="128" rx="20" ry="17" fill="#FFF3E0" />
      {/* Indigo Scholar Scarf / Collar */}
      <path d="M54 106 Q80 116 106 106 L102 116 Q80 124 58 116 Z" fill="#3B2FBF" stroke="#22223B" strokeWidth="2.5" />

      {/* Head */}
      <ellipse cx="80" cy="74" rx="40" ry="34" fill="#FF8C32" stroke="#22223B" strokeWidth="3" />

      {/* Tiger Stripes */}
      <path d="M44 70 L54 73 L45 78" stroke="#22223B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M116 70 L106 73 L115 78" stroke="#22223B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Deep Indigo Headband */}
      <path
        d="M42 58 Q80 48 118 58 L116 67 Q80 57 44 67 Z"
        fill="#3B2FBF"
        stroke="#22223B"
        strokeWidth="2.5"
      />
      {/* Headband Gold Emblem */}
      <circle cx="80" cy="57" r="6" fill="#FFC83D" stroke="#22223B" strokeWidth="2" />

      {/* Muzzle */}
      <ellipse cx="80" cy="86" rx="22" ry="15" fill="#FFF3E0" />

      {/* Eyes */}
      {isSulking ? (
        <>
          <path d="M58 75 Q64 79 70 75" stroke="#22223B" strokeWidth="3" strokeLinecap="round" />
          <path d="M90 75 Q96 79 102 75" stroke="#22223B" strokeWidth="3" strokeLinecap="round" />
        </>
      ) : isCheering ? (
        <>
          <path d="M58 76 Q64 69 70 76" stroke="#22223B" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M90 76 Q96 69 102 76" stroke="#22223B" strokeWidth="3.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="64" cy="75" r="5.5" fill="#22223B" />
          <circle cx="65.8" cy="73.2" r="2" fill="#FFFFFF" />
          <circle cx="96" cy="75" r="5.5" fill="#22223B" />
          <circle cx="97.8" cy="73.2" r="2" fill="#FFFFFF" />
        </>
      )}

      {/* Nose & Expression */}
      <polygon points="75,82 85,82 80,88" fill="#22223B" />
      {isSulking ? (
        <path d="M73 95 Q80 90 87 95" stroke="#22223B" strokeWidth="2.6" strokeLinecap="round" />
      ) : (
        <path d="M72 91 Q80 98 88 91" stroke="#22223B" strokeWidth="2.6" strokeLinecap="round" />
      )}

      {/* Paws */}
      <circle cx="52" cy="120" r="8" fill="#FF8C32" stroke="#22223B" strokeWidth="2.5" />
      <circle cx="110" cy="108" r="8" fill="#FF8C32" stroke="#22223B" strokeWidth="2.5" />
    </svg>
  );
};

export const StudentAvatar: React.FC<{
  avatarId: string;
  size?: number;
  className?: string;
}> = ({ avatarId, size = 40, className = '' }) => {
  const palettes: Record<string, { bg: string; skin: string; hair: string; accent: string; glasses?: boolean }> = {
    'avatar-1': { bg: '#3B2FBF', skin: '#E0AC8B', hair: '#1E1B4B', accent: '#FF7A1A', glasses: true },
    'avatar-2': { bg: '#0F766E', skin: '#D49A73', hair: '#18181B', accent: '#FFC83D' },
    'avatar-3': { bg: '#9A3412', skin: '#E9BA9B', hair: '#27272A', accent: '#22C58B', glasses: true },
    'avatar-4': { bg: '#4338CA', skin: '#C68863', hair: '#09090B', accent: '#FF7A1A' },
    'avatar-5': { bg: '#047857', skin: '#DEB090', hair: '#1E293B', accent: '#FFC83D', glasses: true },
    'avatar-6': { bg: '#B91C1C', skin: '#D9A07B', hair: '#18181B', accent: '#3B2FBF' },
  };
  const p = palettes[avatarId] || palettes['avatar-1'];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full shrink-0 ${className}`}
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="32" fill={p.bg} />
      {/* Shoulders */}
      <path d="M12 62 C14 47, 50 47, 52 62" fill={p.accent} />
      {/* Neck */}
      <rect x="27" y="40" width="10" height="10" rx="4" fill={p.skin} />
      {/* Hair back */}
      <circle cx="32" cy="27" r="16" fill={p.hair} />
      {/* Face */}
      <circle cx="32" cy="29" r="13" fill={p.skin} />
      {/* Headband */}
      <path d="M19 23 Q32 18 45 23 L45 26 Q32 21 19 26 Z" fill={p.accent} />
      {/* Eyes */}
      <circle cx="27" cy="30" r="1.8" fill="#18181B" />
      <circle cx="37" cy="30" r="1.8" fill="#18181B" />
      {p.glasses && (
        <g stroke="#18181B" strokeWidth="1.4" fill="none">
          <circle cx="27" cy="30" r="4" />
          <circle cx="37" cy="30" r="4" />
          <line x1="31" y1="30" x2="33" y2="30" />
        </g>
      )}
      {/* Smile */}
      <path d="M27.5 36 Q32 39.5 36.5 36" stroke="#18181B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
};

export const HeroDuelIllustration: React.FC<{
  onStartDuel?: () => void;
}> = ({ onStartDuel }) => {
  return (
    <div className="relative rounded-2xl border border-[#3B2FBF]/15 dark:border-white/10 bg-white dark:bg-[#1A1740] p-5 sm:p-6 shadow-sm">
      {/* Top duel header */}
      <div className="flex items-center justify-between text-xs font-medium text-[#22223B]/70 dark:text-white/70 pb-4 border-b border-[#22223B]/10 dark:border-white/10">
        <span>Physics Duel · JEE 2025</span>
        <span className="font-score text-[#FF7A1A] font-bold">00:14</span>
      </div>

      {/* Face-off Arena */}
      <div className="grid grid-cols-3 items-center gap-3 py-5">
        {/* Player 1 */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="relative">
            <StudentAvatar avatarId="avatar-1" size={64} />
          </div>
          <div>
            <div className="text-sm font-semibold">Riya S.</div>
            <div className="text-xs text-[#22223B]/60 dark:text-white/60">Kolkata</div>
          </div>
          <div className="font-score text-lg font-bold text-[#3B2FBF] dark:text-[#FFC83D]">240 XP</div>
        </div>

        {/* Center Mascot Referee */}
        <div className="flex flex-col items-center justify-center">
          <TigerMascot mood="battle" size={96} />
          <span className="text-xs font-semibold tracking-wide text-[#FF7A1A] mt-1">VS</span>
        </div>

        {/* Player 2 */}
        <div className="flex flex-col items-center text-center gap-2">
          <StudentAvatar avatarId="avatar-2" size={64} />
          <div>
            <div className="text-sm font-semibold">Aarav V.</div>
            <div className="text-xs text-[#22223B]/60 dark:text-white/60">Patna</div>
          </div>
          <div className="font-score text-lg font-bold text-[#22C58B]">215 XP</div>
        </div>
      </div>

      {/* Live Duel Score Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-score text-[#22223B]/70 dark:text-white/70">
          <span>Riya · 4/5</span>
          <span>Aarav · 3/5</span>
        </div>
        <div className="h-3 w-full rounded-full bg-[#22223B]/10 dark:bg-white/10 overflow-hidden flex">
          <div className="h-full bg-[#3B2FBF] transition-all duration-500" style={{ width: '54%' }} />
          <div className="h-full bg-[#FF7A1A] transition-all duration-500" style={{ width: '46%' }} />
        </div>
      </div>

      {/* Mini Sample Prompt Preview */}
      <div className="mt-5 pt-4 border-t border-[#22223B]/10 dark:border-white/10 flex items-center justify-between gap-3">
        <p className="text-xs text-[#22223B]/75 dark:text-white/75 line-clamp-1">
          “Carnot engine efficiency between 500 K and 300 K…”
        </p>
        {onStartDuel && (
          <button
            type="button"
            onClick={onStartDuel}
            className="text-xs font-semibold text-[#3B2FBF] dark:text-[#FFC83D] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Join duel →
          </button>
        )}
      </div>
    </div>
  );
};
