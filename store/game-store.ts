import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Challenge, MiniGame, Achievement } from '@/types';
import { challenges } from '@/constants/challenges';
import { miniGames } from '@/constants/mini-games';
import { achievements } from '@/constants/achievements';
import { useUserStore } from './user-store';

interface GameState {
  challenges: Challenge[];
  miniGames: MiniGame[];
  achievements: Achievement[];
  dailyChallenges: Challenge[];
  lastDailyChallengeDate: string;
  
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  updateMiniGame: (id: string, updates: Partial<MiniGame>) => void;
  updateAchievement: (id: string, updates: Partial<Achievement>) => void;
  completeChallenge: (id: string) => void;
  unlockChallenge: (id: string) => void;
  unlockMiniGame: (id: string) => void;
  setHighScore: (gameId: string, score: number) => void;
  refreshDailyChallenges: () => void;
  checkAchievementProgress: () => void;
  resetGameProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      challenges: [...challenges],
      miniGames: [...miniGames],
      achievements: [...achievements],
      dailyChallenges: [],
      lastDailyChallengeDate: '',
      
      updateChallenge: (id, updates) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === id ? { ...challenge, ...updates } : challenge
          ),
        }));
      },
      
      updateMiniGame: (id, updates) => {
        set((state) => ({
          miniGames: state.miniGames.map((game) =>
            game.id === id ? { ...game, ...updates } : game
          ),
        }));
      },
      
      updateAchievement: (id, updates) => {
        set((state) => ({
          achievements: state.achievements.map((achievement) =>
            achievement.id === id ? { ...achievement, ...updates } : achievement
          ),
        }));
      },
      
      completeChallenge: (id) => {
        set((state) => {
          // Update the challenge
          const updatedChallenges = state.challenges.map((challenge) =>
            challenge.id === id ? { ...challenge, completed: true } : challenge
          );
          
          // Update daily challenges if needed
          const updatedDailyChallenges = state.dailyChallenges.map((challenge) =>
            challenge.id === id ? { ...challenge, completed: true } : challenge
          );
          
          // Find the challenge to get its points
          const challenge = state.challenges.find(c => c.id === id);
          if (challenge) {
            // Add XP to user
            useUserStore.getState().addXP(challenge.points);
            
            // Update user stats
            const currentStats = useUserStore.getState().stats;
            useUserStore.getState().updateStats({
              totalChallengesCompleted: currentStats.totalChallengesCompleted + 1,
            });
          }
          
          return {
            challenges: updatedChallenges,
            dailyChallenges: updatedDailyChallenges,
          };
        });
        
        // Check achievements after completing a challenge
        get().checkAchievementProgress();
      },
      
      unlockChallenge: (id) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) =>
            challenge.id === id ? { ...challenge, unlocked: true } : challenge
          ),
        }));
      },
      
      unlockMiniGame: (id) => {
        set((state) => ({
          miniGames: state.miniGames.map((game) =>
            game.id === id ? { ...game, unlocked: true } : game
          ),
        }));
      },
      
      setHighScore: (gameId, score) => {
        set((state) => ({
          miniGames: state.miniGames.map((game) =>
            game.id === gameId && score > game.highScore
              ? { ...game, highScore: score }
              : game
          ),
        }));
        
        // Add XP for high scores
        useUserStore.getState().addXP(10);
        
        // Check achievements after setting a high score
        get().checkAchievementProgress();
      },
      
      refreshDailyChallenges: () => {
        const today = new Date().toISOString().split('T')[0];
        const lastDate = get().lastDailyChallengeDate;
        
        // Only refresh if it's a new day
        if (today !== lastDate) {
          const unlockedChallenges = get().challenges.filter(c => c.unlocked);
          const shuffled = [...unlockedChallenges].sort(() => 0.5 - Math.random());
          const newDailyChallenges = shuffled.slice(0, 3).map(c => ({
            ...c,
            completed: false,
          }));
          
          set({
            dailyChallenges: newDailyChallenges,
            lastDailyChallengeDate: today,
          });
        }
      },
      
      checkAchievementProgress: () => {
        const userStats = useUserStore.getState().stats;
        const streak = useUserStore.getState().streak;
        const { challenges, miniGames, achievements } = get();
        
        const updatedAchievements = achievements.map(achievement => {
          let progress = achievement.progress;
          let unlocked = achievement.unlocked;
          
          // Check different achievement types
          switch (achievement.id) {
            case 'first_check_in':
              if (streak.currentStreak > 0) {
                progress = 1;
                unlocked = true;
              }
              break;
            case 'streak_3':
              progress = Math.min(streak.currentStreak, 3);
              unlocked = streak.currentStreak >= 3;
              break;
            case 'streak_7':
              progress = Math.min(streak.currentStreak, 7);
              unlocked = streak.currentStreak >= 7;
              break;
            case 'streak_30':
              progress = Math.min(streak.currentStreak, 30);
              unlocked = streak.currentStreak >= 30;
              break;
            case 'journal_5':
              progress = Math.min(userStats.totalJournalEntries, 5);
              unlocked = userStats.totalJournalEntries >= 5;
              break;
            case 'challenges_10':
              progress = Math.min(userStats.totalChallengesCompleted, 10);
              unlocked = userStats.totalChallengesCompleted >= 10;
              break;
            case 'games_5':
              const gamesPlayed = miniGames.filter(g => g.highScore > 0).length;
              progress = Math.min(gamesPlayed, 5);
              unlocked = gamesPlayed >= 5;
              break;
            case 'level_5':
              progress = Math.min(userStats.level, 5);
              unlocked = userStats.level >= 5;
              break;
            case 'level_10':
              progress = Math.min(userStats.level, 10);
              unlocked = userStats.level >= 10;
              break;
            // Add more achievement checks as needed
          }
          
          // If newly unlocked, add the date
          if (unlocked && !achievement.unlocked) {
            return {
              ...achievement,
              progress,
              unlocked,
              date: new Date().toISOString(),
            };
          }
          
          return {
            ...achievement,
            progress,
            unlocked,
          };
        });
        
        set({ achievements: updatedAchievements });
        
        // If any new achievements were unlocked, add XP
        const newlyUnlocked = updatedAchievements.filter(
          (a, i) => a.unlocked && !achievements[i].unlocked
        );
        
        if (newlyUnlocked.length > 0) {
          useUserStore.getState().addXP(newlyUnlocked.length * 25);
        }
      },
      
      resetGameProgress: () => {
        set({
          challenges: challenges.map(c => ({ ...c, completed: false })),
          miniGames: miniGames.map(g => ({ ...g, highScore: 0 })),
          achievements: achievements.map(a => ({ ...a, unlocked: false, progress: 0 })),
          dailyChallenges: [],
          lastDailyChallengeDate: '',
        });
      },
    }),
    {
      name: 'mindmates-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);