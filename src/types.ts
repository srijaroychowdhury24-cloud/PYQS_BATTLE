export type Language = 'en' | 'bn' | 'hi';

export type PageView =
  | 'home'
  | 'practice'
  | 'battle'
  | 'mocks'
  | 'leaderboard'
  | 'analytics'
  | 'profile';

export type ExamId =
  | 'JEE'
  | 'NEET'
  | 'WBJEE'
  | 'GATE'
  | 'UPSC'
  | 'AFCAT'
  | 'IISER'
  | 'ICAR';

export type SubjectName =
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Biology'
  | 'Computer Science'
  | 'General Studies'
  | 'Quantitative Aptitude'
  | 'Reasoning & Verbal'
  | 'Agriculture';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type RankTier = 'Rookie' | 'Challenger' | 'Warrior' | 'Champion' | 'Legend';

export interface LocalizedContent {
  question: string;
  options: [string, string, string, string];
  explanation: string;
}

export interface PYQQuestion {
  id: string;
  exam: ExamId;
  subject: SubjectName;
  topic: string;
  year: number; // 2016 - 2025 (10 full years)
  difficulty: Difficulty;
  marks: number;
  negativeMarks: number;
  correctIndex: 0 | 1 | 2 | 3;
  content: Record<Language, LocalizedContent>;
}

export interface ExamMeta {
  id: ExamId;
  name: string;
  fullName: string;
  yearsCovered: string;
  totalQuestionsArchive: number;
  subjects: SubjectName[];
  tagline: Record<Language, string>;
}

export interface BattleHistoryItem {
  id: string;
  date: string;
  mode: '1v1 Duel' | 'Squad Battle' | 'Daily Tournament' | 'Friend Challenge';
  exam: ExamId;
  opponentName: string;
  userScore: number;
  opponentScore: number;
  won: boolean;
  xpEarned: number;
}

export interface MockAttemptRecord {
  id: string;
  paperTitle: string;
  exam: ExamId;
  year: number;
  score: number;
  maxScore: number;
  accuracy: number;
  avgTimeSec: number;
  date: string;
}

export interface UserProfile {
  name: string;
  city: string;
  schoolOrCollege: string;
  avatarId: string;
  targetExam: ExamId;
  xp: number;
  streakDays: number;
  streakFreezes: number;
  dailyChallengeDone: boolean;
  solvedIds: string[];
  correctIds: string[];
  bookmarkedIds: string[];
  unlockedBadges: string[];
  battleHistory: BattleHistoryItem[];
  mockAttempts: MockAttemptRecord[];
  activityCalendar: boolean[]; // last 30 days
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  city: string;
  school: string;
  avatarId: string;
  xp: number;
  weeklyXp: number;
  winRate: number;
  streak: number;
  isFriend?: boolean;
}
