import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useMoodJournalStore } from '@/store/mood-journal-store';
import { useGameStore } from '@/store/game-store';
import { DailyCheckIn } from '@/components/DailyCheckIn';
import { UserLevel } from '@/components/UserLevel';
import { StreakCounter } from '@/components/StreakCounter';
import { MoodChart } from '@/components/MoodChart';
import { RecommendedActivities } from '@/components/RecommendedActivities';
import { VoiceRecordingsList } from '@/components/VoiceRecordingsList';

export default function HomeScreen() {
  const userName = useUserStore((state) => state.profile.name);
  const currentMood = useMoodJournalStore((state) => state.currentMood);
  const refreshDailyChallenges = useGameStore((state) => state.refreshDailyChallenges);
  const voiceRecordings = useMoodJournalStore((state) => state.voiceRecordings);
  
  useEffect(() => {
    // Refresh daily challenges when the home screen loads
    refreshDailyChallenges();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userName || 'Friend'}</Text>
          </View>
          {currentMood && (
            <View style={[styles.currentMood, { backgroundColor: currentMood.color + '30' }]}>
              <Text style={styles.currentMoodEmoji}>{currentMood.emoji}</Text>
              <Text style={styles.currentMoodText}>{currentMood.name}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <DailyCheckIn />
          
          <UserLevel />
          
          <StreakCounter />
          
          {voiceRecordings.length > 0 && (
            <VoiceRecordingsList 
              title="Your Positive Affirmations"
              //showPositiveOnly={true}
              limit={3}
            />
          )}
          
          <MoodChart />
          
          <RecommendedActivities />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 16,
    color: colors.neutral,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  currentMood: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  currentMoodEmoji: {
    fontSize: 20,
    marginRight: 4,
  },
  currentMoodText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
});