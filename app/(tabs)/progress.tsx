import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useMoodJournalStore } from '@/store/mood-journal-store';
import { MoodChart } from '@/components/MoodChart';
import { StatsCard } from '@/components/StatsCard';
import { UserLevel } from '@/components/UserLevel';
import { StreakCounter } from '@/components/StreakCounter';
import { Award, Book, Calendar, Target } from 'lucide-react-native';

export default function ProgressScreen() {
  const stats = useUserStore((state) => state.stats);
  const moodHistory = useMoodJournalStore((state) => state.moodHistory);
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Progress</Text>
        
        <UserLevel />
        
        <StreakCounter />
        
        <MoodChart days={14} />
        
        <StatsCard />
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Target size={24} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalChallengesCompleted}</Text>
            <Text style={styles.statLabel}>Challenges Completed</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Book size={24} color={colors.secondary} />
            </View>
            <Text style={styles.statValue}>{stats.totalJournalEntries}</Text>
            <Text style={styles.statLabel}>Journal Entries</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.tertiary + '20' }]}>
              <Calendar size={24} color={colors.tertiary} />
            </View>
            <Text style={styles.statValue}>{stats.streakDays}</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.highlight + '20' }]}>
              <Award size={24} color={colors.highlight} />
            </View>
            <Text style={styles.statValue}>{Math.floor(stats.totalPlayTime / 60)}</Text>
            <Text style={styles.statLabel}>Hours Played</Text>
          </View>
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
  },
});