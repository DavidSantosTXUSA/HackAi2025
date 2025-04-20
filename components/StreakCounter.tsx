import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { Flame } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const StreakCounter: React.FC = () => {
  const streak = useUserStore((state) => state.streak);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF9D7D', '#FFBBA8']}
        style={styles.streakBadge}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Flame size={24} color="#fff" />
      </LinearGradient>
      <View style={styles.streakInfo}>
        <Text style={styles.streakTitle}>Current Streak</Text>
        <Text style={styles.streakCount}>{streak.currentStreak} days</Text>
      </View>
      <View style={styles.bestStreakContainer}>
        <Text style={styles.bestStreakLabel}>Best</Text>
        <Text style={styles.bestStreakValue}>{streak.longestStreak}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  streakBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  streakInfo: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 14,
    color: colors.neutral,
  },
  streakCount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  bestStreakContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bestStreakLabel: {
    fontSize: 12,
    color: colors.neutral,
  },
  bestStreakValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});