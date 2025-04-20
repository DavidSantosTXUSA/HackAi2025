import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Achievement } from '@/types';
import { colors } from '@/constants/colors';
import { Award, Calendar, CalendarCheck, CheckCircle, Book, Target, Gamepad2, Smile, Wind, Brain, Heart, TrendingUp, Trophy } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getIconForAchievement = () => {
    switch (achievement.id) {
      case 'first_check_in':
        return <CheckCircle size={24} color="#fff" />;
      case 'streak_3':
        return <Calendar size={24} color="#fff" />;
      case 'streak_7':
        return <CalendarCheck size={24} color="#fff" />;
      case 'streak_30':
        return <Award size={24} color="#fff" />;
      case 'journal_5':
        return <Book size={24} color="#fff" />;
      case 'challenges_10':
        return <Target size={24} color="#fff" />;
      case 'games_5':
        return <Gamepad2 size={24} color="#fff" />;
      case 'mood_variety':
        return <Smile size={24} color="#fff" />;
      case 'breathing_master':
        return <Wind size={24} color="#fff" />;
      case 'mindfulness_guru':
        return <Brain size={24} color="#fff" />;
      case 'gratitude_expert':
        return <Heart size={24} color="#fff" />;
      case 'level_5':
        return <TrendingUp size={24} color="#fff" />;
      case 'level_10':
        return <Trophy size={24} color="#fff" />;
      default:
        return <Award size={24} color="#fff" />;
    }
  };

  return (
    <View style={[styles.container, achievement.unlocked ? styles.unlockedContainer : styles.lockedContainer]}>
      <LinearGradient
        colors={achievement.unlocked ? ['#6C63FF', '#8F8AFF'] : ['#A0AEC0', '#CBD5E0']}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {getIconForAchievement()}
      </LinearGradient>
      <View style={styles.content}>
        <Text style={[styles.title, !achievement.unlocked && styles.lockedText]}>
          {achievement.title}
        </Text>
        <Text style={[styles.description, !achievement.unlocked && styles.lockedText]} numberOfLines={2}>
          {achievement.description}
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(achievement.progress / achievement.total) * 100}%` },
                achievement.unlocked && styles.completedProgressFill
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {achievement.progress}/{achievement.total}
          </Text>
        </View>
      </View>
      {achievement.unlocked && achievement.date && (
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>
            {new Date(achievement.date).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  unlockedContainer: {
    borderColor: colors.primary + '30',
  },
  lockedContainer: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 8,
  },
  lockedText: {
    color: colors.neutral,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.neutral,
    borderRadius: 3,
  },
  completedProgressFill: {
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 12,
    color: colors.neutral,
    fontWeight: '500',
  },
  dateBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dateText: {
    fontSize: 10,
    color: colors.neutral,
  },
});