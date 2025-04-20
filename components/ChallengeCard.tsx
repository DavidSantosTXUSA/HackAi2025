import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Challenge } from '@/types';
import { colors } from '@/constants/colors';
import { Activity, Award, Check, Clock, Heart, Target, Wind, Brain, MessageCircle, Eye } from 'lucide-react-native';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: (challenge: Challenge) => void;
  isCompleted?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  isCompleted = false,
}) => {
  const getIconForType = () => {
    switch (challenge.type) {
      case 'breathing':
        return <Wind size={24} color={colors.primary} />;
      case 'mindfulness':
        return <Eye size={24} color={colors.primary} />;
      case 'gratitude':
        return <Heart size={24} color={colors.primary} />;
      case 'physical':
        return <Activity size={24} color={colors.primary} />;
      case 'cognitive':
        return <Brain size={24} color={colors.primary} />;
      case 'social':
        return <MessageCircle size={24} color={colors.primary} />;
      default:
        return <Target size={24} color={colors.primary} />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompleted && styles.completedContainer,
      ]}
      onPress={() => onPress(challenge)}
      disabled={isCompleted}
    >
      <View style={styles.iconContainer}>
        {getIconForType()}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.neutral} />
            <Text style={styles.timeText}>{challenge.duration} min</Text>
          </View>
          <View style={styles.pointsContainer}>
            <Award size={14} color={colors.neutral} />
            <Text style={styles.pointsText}>{challenge.points} XP</Text>
          </View>
        </View>
      </View>
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Check size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
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
  completedContainer: {
    opacity: 0.7,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 12,
    color: colors.neutral,
    marginLeft: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 12,
    color: colors.neutral,
    marginLeft: 4,
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});