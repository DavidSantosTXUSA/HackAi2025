export type Mood = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  intensity: number; // 1-5
};

export type VoiceRecording = {
  id: string;
  date: string;
  uri: string;
  duration: number; // in seconds
  moodId: string;
  isPositiveAffirmation: boolean;
  title?: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: Mood;
  content: string;
  tags: string[];
  isPrivate: boolean;
  voiceRecordingId?: string;
};

export type InteractiveContent = {
  type: string;
  [key: string]: any;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  type: 'breathing' | 'mindfulness' | 'gratitude' | 'physical' | 'cognitive' | 'social';
  duration: number; // in minutes
  points: number;
  completed: boolean;
  unlocked: boolean;
  icon: string;
  interactiveContent?: InteractiveContent;
};

export type MiniGame = {
  id: string;
  name: string;
  description: string;
  type: 'focus' | 'memory' | 'creativity' | 'problem-solving' | 'emotional';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  points: number;
  highScore: number;
  icon: string;
  unlocked: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
  date?: string;
};

export type UserStats = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  totalChallengesCompleted: number;
  totalJournalEntries: number;
  totalPlayTime: number; // in minutes
  focusScore: number; // 0-100
  creativityScore: number; // 0-100
  resilienceScore: number; // 0-100
  mindfulnessScore: number; // 0-100
  emotionalIQScore: number; // 0-100
};

export type Message = {
  id: string;
  content: string;
  isAudio: boolean;
  timestamp: string;
  sender: 'user' | 'friend';
};

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  ageRange: string;
  personality: string[];
  hobbies: string[];
  matchReason: string;
  lastActive: string;
  lastPokeTime?: string;
  messages?: Message[];
};

export type UserProfile = {
  name: string;
  avatar: string;
  ageRange?: string;
  personality?: string[];
  hobbies?: string[];
  musicTaste?: string[];
  emotionalNeeds?: string[];
  commonMoods?: string[];
  learningStyle?: string[];
  birthdate?: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    soundEffects: boolean;
    music: boolean;
    hapticFeedback: boolean;
  };
};

export type DailyStreak = {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string;
};

export type AppState = {
  currentMood?: Mood;
  dailyChallenge?: Challenge;
  recentAchievements: Achievement[];
  recommendedActivities: (Challenge | MiniGame)[];
};

export type GratitudePlant = {
  id: string;
  type: string;
  stage: number; // 1-5 for growth stages
  entries: string[];
  dateCreated: string;
  lastWatered: string;
};

export type WordBuilderGame = {
  letters: string[];
  foundWords: string[];
  possibleWords: string[];
  timeRemaining: number;
  score: number;
};