import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { ProgressBar } from './ProgressBar';

export const UserLevel: React.FC = () => {
  const { level, xp, xpToNextLevel } = useUserStore((state) => state.stats);
  const progress = xp / xpToNextLevel;

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{level}</Text>
        </View>
        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>Level {level}</Text>
          <Text style={styles.xpText}>{xp} / {xpToNextLevel} XP</Text>
        </View>
      </View>
      <ProgressBar 
        progress={progress} 
        showPercentage={false} 
        height={8}
        gradientColors={['#6C63FF', '#8F8AFF']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  levelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  xpText: {
    fontSize: 14,
    color: colors.neutral,
  },
});