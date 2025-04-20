import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, UserStats, DailyStreak, Friend } from '@/types';
import { generateFriendRecommendations } from '@/utils/ai-service';

interface UserState {
  profile: UserProfile;
  stats: UserStats;
  streak: DailyStreak;
  isOnboarded: boolean;
  friends: Friend[];
  recommendedFriends: Friend[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateStats: (stats: Partial<UserStats>) => void;
  updateStreak: (streak: Partial<DailyStreak>) => void;
  addXP: (amount: number) => void;
  checkLevelUp: () => boolean;
  setOnboarded: (value: boolean) => void;
  resetProgress: () => void;
  generateRecommendedFriends: (userData: any) => Promise<void>;
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  sendCheckInPoke: (friendId: string) => void;
  sendMessage: (friendId: string, message: string, isAudio?: boolean, sender?: string) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  avatar: 'default',
  ageRange: '',
  personality: [],
  hobbies: [],
  musicTaste: [],
  emotionalNeeds: [],
  commonMoods: [],
  learningStyle: [],
  preferences: {
    notifications: true,
    darkMode: false,
    soundEffects: true,
    music: true,
    hapticFeedback: true,
  },
};

const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streakDays: 0,
  totalChallengesCompleted: 0,
  totalJournalEntries: 0,
  totalPlayTime: 0,
  focusScore: 50,
  creativityScore: 50,
  resilienceScore: 50,
  mindfulnessScore: 50,
  emotionalIQScore: 50,
};

const DEFAULT_STREAK: DailyStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastCheckIn: '',
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      stats: DEFAULT_STATS,
      streak: DEFAULT_STREAK,
      isOnboarded: false,
      friends: [],
      recommendedFriends: [],

      updateProfile: (newProfileData) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...newProfileData,
          },
        }));
      },

      updateStats: (newStatsData) => {
        set((state) => ({
          stats: {
            ...state.stats,
            ...newStatsData,
          },
        }));
      },

      updateStreak: (newStreakData) => {
        set((state) => ({
          streak: {
            ...state.streak,
            ...newStreakData,
          },
        }));
      },

      addXP: (amount) => {
        set((state) => {
          const newXP = state.stats.xp + amount;
          const xpToNextLevel = state.stats.xpToNextLevel;
          
          if (newXP >= xpToNextLevel) {
            // Level up
            const remainingXP = newXP - xpToNextLevel;
            const newLevel = state.stats.level + 1;
            const newXPToNextLevel = Math.floor(xpToNextLevel * 1.5);
            
            return {
              stats: {
                ...state.stats,
                level: newLevel,
                xp: remainingXP,
                xpToNextLevel: newXPToNextLevel,
              },
            };
          }
          
          return {
            stats: {
              ...state.stats,
              xp: newXP,
            },
          };
        });
      },

      checkLevelUp: () => {
        const { xp, xpToNextLevel } = get().stats;
        return xp >= xpToNextLevel;
      },

      setOnboarded: (value) => {
        set({ isOnboarded: value });
      },

      resetProgress: () => {
        set({
          stats: DEFAULT_STATS,
          streak: DEFAULT_STREAK,
        });
      },
      
      generateRecommendedFriends: async (userData) => {
        try {
          const recommendations = await generateFriendRecommendations(userData);
          set({ recommendedFriends: recommendations });
        } catch (error) {
          console.error("Error generating friend recommendations:", error);
          // Fallback to mock data if AI service fails
          const mockRecommendations = [
            {
              id: "rec1",
              name: "Alex",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
              ageRange: userData.ageRange,
              personality: ["Creative", "Adventurous"],
              hobbies: ["Music", "Hiking"],
              matchReason: "You both enjoy Music",
              lastActive: "2 hours ago",
              messages: [],
            },
            {
              id: "rec2",
              name: "Jordan",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
              ageRange: userData.ageRange,
              personality: ["Introverted", "Analytical"],
              hobbies: ["Reading", "Gaming"],
              matchReason: userData.hobbies.includes("Reading") ? "You both enjoy Reading" : "Similar personality traits",
              lastActive: "1 day ago",
              messages: [],
            },
            {
              id: "rec3",
              name: "Taylor",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
              ageRange: userData.ageRange,
              personality: ["Extroverted", "Spontaneous"],
              hobbies: ["Travel", "Photography"],
              matchReason: userData.personality.includes("Spontaneous") ? "You're both Spontaneous" : "Complementary personalities",
              lastActive: "3 hours ago",
              messages: [],
            },
            {
              id: "rec4",
              name: "Riley",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
              ageRange: userData.ageRange,
              personality: ["Creative", "Organized"],
              hobbies: ["Art", "Writing"],
              matchReason: userData.hobbies.includes("Art") ? "You both enjoy Art" : "Creative personalities",
              lastActive: "Just now",
              messages: [],
            },
            {
              id: "rec5",
              name: "Casey",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
              ageRange: userData.ageRange,
              personality: ["Adventurous", "Extroverted"],
              hobbies: ["Sports", "Travel"],
              matchReason: userData.hobbies.includes("Sports") ? "You both enjoy Sports" : "Similar age group",
              lastActive: "5 hours ago",
              messages: [],
            },
          ];
          set({ recommendedFriends: mockRecommendations });
        }
      },
      
      addFriend: (friend) => {
        set((state) => {
          // Add to friends list
          const updatedFriends = [...state.friends, friend];
          
          // Remove from recommended list
          const updatedRecommended = state.recommendedFriends.filter(
            rec => rec.id !== friend.id
          );
          
          return {
            friends: updatedFriends,
            recommendedFriends: updatedRecommended
          };
        });
      },
      
      removeFriend: (friendId) => {
        set((state) => ({
          friends: state.friends.filter(friend => friend.id !== friendId)
        }));
      },
      
      sendCheckInPoke: (friendId) => {
        set((state) => {
          const updatedFriends = state.friends.map(friend => {
            if (friend.id === friendId) {
              return {
                ...friend,
                lastPokeTime: new Date().toISOString(),
              };
            }
            return friend;
          });
          
          return { friends: updatedFriends };
        });
      },
      
      sendMessage: (friendId, message, isAudio = false, sender = 'user') => {
        set((state) => {
          const updatedFriends = state.friends.map(friend => {
            if (friend.id === friendId) {
              const newMessage = {
                id: Date.now().toString(),
                content: message,
                isAudio,
                timestamp: new Date().toISOString(),
                sender,
              };
              
              return {
                ...friend,
                messages: [...(friend.messages || []), newMessage],
              };
            }
            return friend;
          });
          
          return { friends: updatedFriends };
        });
      },
    }),
    {
      name: 'mindmates-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);