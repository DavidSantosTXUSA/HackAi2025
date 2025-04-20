import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MiniGame } from '@/types';
import { colors } from '@/constants/colors';
import { Award, Clock, Grid, Search, Target, Type, Puzzle, Repeat, Wind, Flower } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MiniGameCardProps {
  game: MiniGame;
  onPress: (game: MiniGame) => void;
}

export const MiniGameCard: React.FC<MiniGameCardProps> = ({ game, onPress }) => {
  const getIconForType = () => {
    switch (game.id) {
      case 'memory_match':
        return <Grid size={24} color="#fff" />;
      case 'emotion_detective':
        return <Search size={24} color="#fff" />;
      case 'focus_flow':
        return <Target size={24} color="#fff" />;
      case 'word_builder':
        return <Type size={24} color="#fff" />;
      case 'puzzle_solver':
        return <Puzzle size={24} color="#fff" />;
      case 'pattern_recognition':
        return <Repeat size={24} color="#fff" />;
      case 'breathing_game':
        return <Wind size={24} color="#fff" />;
      case 'gratitude_garden':
        return <Flower size={24} color="#fff" />;
      default:
        return <Target size={24} color="#fff" />;
    }
  };

  const getGradientForType = () => {
    switch (game.type) {
      case 'focus':
        return ['#6C63FF', '#8F8AFF'];
      case 'memory':
        return ['#FF9D7D', '#FFBBA8'];
      case 'creativity':
        return ['#FFE27D', '#FFEFB9'];
      case 'problem-solving':
        return ['#805AD5', '#B794F4'];
      case 'emotional':
        return ['#63E2FF', '#B6F0FF'];
      default:
        return ['#6C63FF', '#8F8AFF'];
    }
  };

  const getDifficultyColor = () => {
    switch (game.difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.danger;
      default:
        return colors.neutral;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(game)}
    >
      <LinearGradient
        colors={getGradientForType()}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {getIconForType()}
      </LinearGradient>
      <View style={styles.content}>
        <Text style={styles.title}>{game.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {game.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.neutral} />
            <Text style={styles.timeText}>{game.duration} min</Text>
          </View>
          <View style={styles.pointsContainer}>
            <Award size={14} color={colors.neutral} />
            <Text style={styles.pointsText}>{game.points} XP</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() + '20', borderColor: getDifficultyColor() }]}>
            <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
              {game.difficulty}
            </Text>
          </View>
        </View>
      </View>
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
    marginRight: 16,
  },
  pointsText: {
    fontSize: 12,
    color: colors.neutral,
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});