import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { ProgressBar } from './ProgressBar';
import { Brain, Heart, Lightbulb, Target, Zap } from 'lucide-react-native';

export const StatsCard: React.FC = () => {
  const stats = useUserStore((state) => state.stats);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Mental Strength</Text>
      
      <View style={styles.statRow}>
        <View style={styles.statIcon}>
          <Brain size={20} color={colors.primary} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>Focus</Text>
          <ProgressBar 
            progress={stats.focusScore / 100} 
            showPercentage={false}
            height={8}
            gradientColors={['#6C63FF', '#8F8AFF']}
          />
        </View>
        <Text style={styles.statValue}>{stats.focusScore}</Text>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statIcon}>
          <Lightbulb size={20} color={colors.secondary} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>Creativity</Text>
          <ProgressBar 
            progress={stats.creativityScore / 100} 
            showPercentage={false}
            height={8}
            gradientColors={['#FF9D7D', '#FFBBA8']}
          />
        </View>
        <Text style={styles.statValue}>{stats.creativityScore}</Text>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statIcon}>
          <Target size={20} color={colors.tertiary} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>Resilience</Text>
          <ProgressBar 
            progress={stats.resilienceScore / 100} 
            showPercentage={false}
            height={8}
            gradientColors={['#63E2FF', '#B6F0FF']}
          />
        </View>
        <Text style={styles.statValue}>{stats.resilienceScore}</Text>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statIcon}>
          <Zap size={20} color={colors.highlight} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>Mindfulness</Text>
          <ProgressBar 
            progress={stats.mindfulnessScore / 100} 
            showPercentage={false}
            height={8}
            gradientColors={['#FFE27D', '#FFEFB9']}
          />
        </View>
        <Text style={styles.statValue}>{stats.mindfulnessScore}</Text>
      </View>
      
      <View style={styles.statRow}>
        <View style={styles.statIcon}>
          <Heart size={20} color={colors.danger} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statLabel}>Emotional IQ</Text>
          <ProgressBar 
            progress={stats.emotionalIQScore / 100} 
            showPercentage={false}
            height={8}
            gradientColors={['#F56565', '#FC8181']}
          />
        </View>
        <Text style={styles.statValue}>{stats.emotionalIQScore}</Text>
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
});