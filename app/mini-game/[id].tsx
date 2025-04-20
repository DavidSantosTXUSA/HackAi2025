import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useGameStore } from '@/store/game-store';
import { MiniGame } from '@/types';
import { Award, Clock, Grid, Target, Type, Puzzle, Repeat, Wind, Flower, Trophy } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MemoryMatchGame } from '@/components/games/MemoryMatchGame';
import { BreathPacerGame } from '@/components/games/BreathPacerGame';
import { WordBuilderGame } from '@/components/games/WordBuilderGame';
import { FocusFlowGame } from '@/components/games/FocusFlowGame';
import { GratitudeGardenGame } from '@/components/games/GratitudeGardenGame';

export default function MiniGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { miniGames, setHighScore } = useGameStore();
  const [game, setGame] = useState<MiniGame | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  
  // Load game data
  useEffect(() => {
    if (id) {
      const foundGame = miniGames.find(g => g.id === id);
      if (foundGame) {
        setGame(foundGame);
      }
    }
  }, [id, miniGames]);
  
  const handleStart = () => {
    setIsPlaying(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  const handleGameComplete = (gameScore: number) => {
    setScore(gameScore);
    setIsComplete(true);
    setIsPlaying(false);
    
    if (game && gameScore > game.highScore) {
      setHighScore(game.id, gameScore);
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const getIconForGame = () => {
    if (!game) return <Target size={24} color="#fff" />;
    
    switch (game.id) {
      case 'memory_match':
        return <Grid size={24} color="#fff" />;
      case 'focus_flow':
        return <Target size={24} color="#fff" />;
      case 'word_builder':
        return <Type size={24} color="#fff" />;
      case 'puzzle_solver':
      case 'logic_puzzles_easy':
      case 'logic_puzzles_medium':
      case 'logic_puzzles_hard':
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
  
  // Handle logic puzzle navigation
  const handleLogicPuzzleNavigation = (difficulty: string) => {
    router.replace(`/mini-game/logic-puzzles/${difficulty}`);
  };
  
  const renderGameContent = () => {
    if (!game) return null;
    
    switch (game.id) {
      case 'memory_match':
        return <MemoryMatchGame onComplete={handleGameComplete} />;
      case 'breathing_game':
        return <BreathPacerGame onComplete={handleGameComplete} />;
      case 'word_builder':
        return <WordBuilderGame onComplete={handleGameComplete} />;
      case 'focus_flow':
        return <FocusFlowGame onComplete={handleGameComplete} />;
      case 'gratitude_garden':
        return <GratitudeGardenGame onComplete={handleGameComplete} />;
      case 'logic_puzzles_easy':
        // Navigate to logic puzzles screen
        setTimeout(() => {
          handleLogicPuzzleNavigation('easy');
        }, 100);
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Loading easy puzzles...
            </Text>
          </View>
        );
      case 'logic_puzzles_medium':
        setTimeout(() => {
          handleLogicPuzzleNavigation('medium');
        }, 100);
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Loading medium puzzles...
            </Text>
          </View>
        );
      case 'logic_puzzles_hard':
        setTimeout(() => {
          handleLogicPuzzleNavigation('hard');
        }, 100);
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Loading hard puzzles...
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              This mini-game is coming soon!
            </Text>
          </View>
        );
    }
  };
  
  if (!game) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Game not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: game.name,
          headerBackTitle: 'Back',
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <LinearGradient
          colors={['#6C63FF', '#8F8AFF']}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {getIconForGame()}
        </LinearGradient>
        
        <Text style={styles.title}>{game.name}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.neutral} />
            <Text style={styles.infoText}>{game.duration} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Award size={16} color={colors.neutral} />
            <Text style={styles.infoText}>{game.points} XP</Text>
          </View>
          {game.highScore > 0 && (
            <View style={styles.infoItem}>
              <Trophy size={16} color={colors.neutral} />
              <Text style={styles.infoText}>Best: {game.highScore}</Text>
            </View>
          )}
        </View>
        
        {!isPlaying && !isComplete && (
          <>
            <Text style={styles.description}>{game.description}</Text>
            
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStart}
            >
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Back</Text>
            </TouchableOpacity>
          </>
        )}
        
        {isPlaying && renderGameContent()}
        
        {isComplete && (
          <View style={styles.completedContainer}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreText}>{score}</Text>
            </View>
            <Text style={styles.completedText}>Game Complete!</Text>
            <Text style={styles.completedSubtext}>
              {score > game.highScore 
                ? `New high score! You've earned ${game.points} XP.`
                : `You've earned ${Math.floor(game.points * 0.7)} XP.`}
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.playAgainButton}
                onPress={() => {
                  setIsComplete(false);
                  setIsPlaying(false);
                  setTimeout(() => setIsPlaying(true), 100);
                }}
              >
                <Text style={styles.playAgainButtonText}>Play Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>Back to Games</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.neutral,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.neutral,
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    marginTop: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  completedContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  scoreBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  completedText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  completedSubtext: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  playAgainButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});