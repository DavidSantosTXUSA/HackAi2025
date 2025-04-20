import { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    id: "first_check_in",
    title: "First Steps",
    description: "Complete your first mood check-in",
    icon: "check-circle",
    unlocked: false,
    progress: 0,
    total: 1,
  },
  {
    id: "streak_3",
    title: "Consistency Counts",
    description: "Check in for 3 days in a row",
    icon: "calendar",
    unlocked: false,
    progress: 0,
    total: 3,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "calendar-check",
    unlocked: false,
    progress: 0,
    total: 7,
  },
  {
    id: "streak_30",
    title: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "award",
    unlocked: false,
    progress: 0,
    total: 30,
  },
  {
    id: "journal_5",
    title: "Thoughtful Reflector",
    description: "Write 5 journal entries",
    icon: "book",
    unlocked: false,
    progress: 0,
    total: 5,
  },
  {
    id: "challenges_10",
    title: "Challenge Champion",
    description: "Complete 10 daily challenges",
    icon: "target",
    unlocked: false,
    progress: 0,
    total: 10,
  },
  {
    id: "games_5",
    title: "Game Enthusiast",
    description: "Play 5 different mini-games",
    icon: "gamepad-2",
    unlocked: false,
    progress: 0,
    total: 5,
  },
  {
    id: "mood_variety",
    title: "Emotional Explorer",
    description: "Track 5 different moods",
    icon: "smile",
    unlocked: false,
    progress: 0,
    total: 5,
  },
  {
    id: "breathing_master",
    title: "Breathing Master",
    description: "Complete 10 breathing exercises",
    icon: "wind",
    unlocked: false,
    progress: 0,
    total: 10,
  },
  {
    id: "mindfulness_guru",
    title: "Mindfulness Guru",
    description: "Complete 15 mindfulness activities",
    icon: "brain",
    unlocked: false,
    progress: 0,
    total: 15,
  },
  {
    id: "gratitude_expert",
    title: "Gratitude Expert",
    description: "Record 20 things you're grateful for",
    icon: "heart",
    unlocked: false,
    progress: 0,
    total: 20,
  },
  {
    id: "level_5",
    title: "Growth Mindset",
    description: "Reach level 5",
    icon: "trending-up",
    unlocked: false,
    progress: 0,
    total: 5,
  },
  {
    id: "level_10",
    title: "Mind Athlete",
    description: "Reach level 10",
    icon: "trophy",
    unlocked: false,
    progress: 0,
    total: 10,
  },
];

export const getUnlockedAchievements = (): Achievement[] => {
  return achievements.filter(achievement => achievement.unlocked);
};

export const getInProgressAchievements = (): Achievement[] => {
  return achievements.filter(achievement => !achievement.unlocked && achievement.progress > 0);
};