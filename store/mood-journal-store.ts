import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, Mood, VoiceRecording } from '@/types';
import { moods } from '@/constants/moods';

interface MoodJournalState {
  entries: JournalEntry[];
  currentMood: Mood | null;
  moodHistory: {
    date: string;
    mood: Mood;
  }[];
  voiceRecordings: VoiceRecording[];
  
  setCurrentMood: (mood: Mood) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  getEntriesByDate: (date: string) => JournalEntry[];
  getEntriesByMood: (moodId: string) => JournalEntry[];
  getMoodByDate: (date: string) => Mood | null;
  getMoodTrend: (days: number) => { date: string; mood: Mood }[];
  
  addVoiceRecording: (recording: Omit<VoiceRecording, 'id' | 'date'>) => string;
  getVoiceRecordingById: (id: string) => VoiceRecording | undefined;
  getRecentVoiceRecordings: (limit?: number) => VoiceRecording[];
  getPositiveAffirmations: (limit?: number) => VoiceRecording[];
  deleteVoiceRecording: (id: string) => void;
  
  clearAllEntries: () => void;
}

export const useMoodJournalStore = create<MoodJournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      currentMood: null,
      moodHistory: [],
      voiceRecordings: [],
      
      setCurrentMood: (mood) => {
        const today = new Date().toISOString().split('T')[0];
        
        set((state) => {
          // Remove any existing mood for today
          const filteredHistory = state.moodHistory.filter(item => item.date !== today);
          
          return {
            currentMood: mood,
            moodHistory: [...filteredHistory, { date: today, mood }],
          };
        });
      },
      
      addJournalEntry: (entry) => {
        const id = Date.now().toString();
        const date = new Date().toISOString();
        
        set((state) => ({
          entries: [...state.entries, { ...entry, id, date }],
        }));
      },
      
      updateJournalEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        }));
      },
      
      deleteJournalEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },
      
      getEntriesByDate: (date) => {
        return get().entries.filter(
          (entry) => entry.date.split('T')[0] === date
        );
      },
      
      getEntriesByMood: (moodId) => {
        return get().entries.filter((entry) => entry.mood.id === moodId);
      },
      
      getMoodByDate: (date) => {
        const moodForDate = get().moodHistory.find(item => item.date === date);
        return moodForDate ? moodForDate.mood : null;
      },
      
      getMoodTrend: (days) => {
        const today = new Date();
        const result = [];
        
        for (let i = 0; i < days; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          
          const moodForDate = get().moodHistory.find(item => item.date === dateString);
          
          if (moodForDate) {
            result.unshift(moodForDate);
          }
        }
        
        return result;
      },
      
      addVoiceRecording: (recording) => {
        const id = Date.now().toString();
        const date = new Date().toISOString();
        const newRecording = { ...recording, id, date };
        
        set((state) => ({
          voiceRecordings: [...state.voiceRecordings, newRecording],
        }));
        
        return id;
      },
      
      getVoiceRecordingById: (id) => {
        return get().voiceRecordings.find(recording => recording.id === id);
      },
      
      getRecentVoiceRecordings: (limit = 5) => {
        return [...get().voiceRecordings]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },
      
      getPositiveAffirmations: (limit = 5) => {
        return [...get().voiceRecordings]
          .filter(recording => recording.isPositiveAffirmation)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },
      
      deleteVoiceRecording: (id) => {
        set((state) => ({
          voiceRecordings: state.voiceRecordings.filter(recording => recording.id !== id),
          // Also update any journal entries that reference this recording
          entries: state.entries.map(entry => 
            entry.voiceRecordingId === id 
              ? { ...entry, voiceRecordingId: undefined } 
              : entry
          ),
        }));
      },
      
      clearAllEntries: () => {
        set({
          entries: [],
          moodHistory: [],
          currentMood: null,
          voiceRecordings: [],
        });
      },
    }),
    {
      name: 'mindmates-mood-journal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);