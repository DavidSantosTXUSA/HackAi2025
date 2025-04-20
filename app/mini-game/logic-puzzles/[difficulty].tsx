import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useGameStore } from '@/store/game-store';
import { useUserStore } from '@/store/user-store';
import { Award, Brain, Check, ChevronRight, Clock, HelpCircle, Puzzle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Define puzzle types
type PuzzleOption = {
  id: string;
  text: string;
};

type LogicPuzzle = {
  id: string;
  question: string;
  options: PuzzleOption[];
  correctAnswer: string;
  hint?: string;
  explanation: string;
};

// Puzzles by difficulty
const easyPuzzles: LogicPuzzle[] = [
  {
    id: 'easy1',
    question: 'If all roses are flowers and some flowers fade quickly, then:',
    options: [
      { id: 'a', text: 'All roses fade quickly' },
      { id: 'b', text: 'Some roses may fade quickly' },
      { id: 'c', text: 'No roses fade quickly' },
      { id: 'd', text: 'Roses are not flowers' },
    ],
    correctAnswer: 'b',
    hint: 'Think about the relationship between "all" and "some" statements.',
    explanation: 'Since all roses are flowers, and some flowers fade quickly, it follows that some roses MAY fade quickly. We cannot say "all roses" because the original statement only says "some flowers."'
  },
  {
    id: 'easy2',
    question: 'If it is raining, then the ground is wet. The ground is wet. Therefore:',
    options: [
      { id: 'a', text: 'It must be raining' },
      { id: 'b', text: 'It might be raining' },
      { id: 'c', text: 'It is not raining' },
      { id: 'd', text: 'The ground is dry' },
    ],
    correctAnswer: 'b',
    hint: 'Be careful about assuming the reverse of a conditional statement.',
    explanation: 'This is a common logical fallacy. Just because rain causes wet ground doesn\'t mean wet ground is always caused by rain. The ground could be wet for other reasons (sprinklers, etc.).'
  },
  {
    id: 'easy3',
    question: 'All mammals are warm-blooded. A dolphin is a mammal. Therefore:',
    options: [
      { id: 'a', text: 'Dolphins are not warm-blooded' },
      { id: 'b', text: 'Some dolphins are warm-blooded' },
      { id: 'c', text: 'All dolphins are warm-blooded' },
      { id: 'd', text: 'Dolphins are not mammals' },
    ],
    correctAnswer: 'c',
    hint: 'Apply the first statement to the specific case in the second statement.',
    explanation: 'This is a valid syllogism. If all mammals are warm-blooded, and all dolphins are mammals, then all dolphins must be warm-blooded.'
  }
];

const mediumPuzzles: LogicPuzzle[] = [
  {
    id: 'medium1',
    question: 'Five people are sitting in a row. Amy is sitting next to Bob. Bob is sitting next to Cathy. David is sitting next to Elaine. Elaine is sitting next to Cathy. Who is sitting in the middle?',
    options: [
      { id: 'a', text: 'Amy' },
      { id: 'b', text: 'Bob' },
      { id: 'c', text: 'Cathy' },
      { id: 'd', text: 'David' },
      { id: 'e', text: 'Elaine' },
    ],
    correctAnswer: 'c',
    hint: 'Try drawing out the possible arrangements based on the given information.',
    explanation: 'From the clues, we can determine that the arrangement must be: Amy-Bob-Cathy-Elaine-David or David-Elaine-Cathy-Bob-Amy. In both cases, Cathy is in the middle.'
  },
  {
    id: 'medium2',
    question: 'If no heroes are cowards, and some soldiers are cowards, then:',
    options: [
      { id: 'a', text: 'All heroes are soldiers' },
      { id: 'b', text: 'No heroes are soldiers' },
      { id: 'c', text: 'Some soldiers are not heroes' },
      { id: 'd', text: 'Some heroes are not soldiers' },
    ],
    correctAnswer: 'c',
    hint: 'Think about the relationship between the sets of heroes, cowards, and soldiers.',
    explanation: 'Since some soldiers are cowards, and no heroes are cowards, it follows that those soldiers who are cowards cannot be heroes. Therefore, some soldiers are not heroes.'
  },
  {
    id: 'medium3',
    question: 'In a race, Jack finished before Mike, Peter finished before Jack, and Mike finished before Quinn. Who finished last?',
    options: [
      { id: 'a', text: 'Jack' },
      { id: 'b', text: 'Mike' },
      { id: 'c', text: 'Peter' },
      { id: 'd', text: 'Quinn' },
    ],
    correctAnswer: 'd',
    hint: 'Try arranging the racers in order based on the given information.',
    explanation: 'From the clues, we can determine that Peter finished first, followed by Jack, then Mike, and finally Quinn. The order is: Peter > Jack > Mike > Quinn.'
  }
];

const hardPuzzles: LogicPuzzle[] = [
  {
    id: 'hard1',
    question: 'Three friends (Alex, Blake, and Casey) each have a different pet (dog, cat, and bird), but not necessarily in that order. Alex does not have the bird. The person with the cat is not Blake. Casey does not have the dog. Who has the bird?',
    options: [
      { id: 'a', text: 'Alex' },
      { id: 'b', text: 'Blake' },
      { id: 'c', text: 'Casey' },
    ],
    correctAnswer: 'b',
    hint: 'Try eliminating possibilities based on the given constraints.',
    explanation: 'Alex doesn\'t have the bird, and Casey doesn\'t have the dog. Blake doesn\'t have the cat. If Casey doesn\'t have the dog and Alex doesn\'t have the bird, Casey must have the cat. This means Blake can\'t have the cat, and Alex can\'t have the bird, so Blake must have the bird and Alex must have the dog.'
  },
  {
    id: 'hard2',
    question: 'If all A are B, and no B are C, and some D are C, then:',
    options: [
      { id: 'a', text: 'Some D are A' },
      { id: 'b', text: 'No D are A' },
      { id: 'c', text: 'Some D are not A' },
      { id: 'd', text: 'All D are A' },
    ],
    correctAnswer: 'c',
    hint: 'Consider which sets have elements that cannot overlap.',
    explanation: 'Since all A are B, and no B are C, it follows that no A are C. Since some D are C, those D cannot be A. Therefore, some D are not A.'
  },
  {
    id: 'hard3',
    question: 'Five houses in a row are painted five different colors. The green house is next to the white house. The red house is on the edge. The yellow house is not next to the blue house. The white house is on the edge. What color is the middle house?',
    options: [
      { id: 'a', text: 'Green' },
      { id: 'b', text: 'White' },
      { id: 'c', text: 'Red' },
      { id: 'd', text: 'Yellow' },
      { id: 'e', text: 'Blue' },
    ],
    correctAnswer: 'a',
    hint: 'Start with the houses on the edges and work inward.',
    explanation: 'The white and red houses are on the edges. The green house is next to white, so it must be second from one edge. The yellow house is not next to blue, so with five houses in a row, the blue house must be second from the other edge, and yellow must be in the middle. However, we determined green is second from one edge, so green must be in the middle.'
  }
];

export default function LogicPuzzlesScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const router = useRouter();
  const { setHighScore } = useGameStore();
  const { addXP } = useUserStore();
  
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  // Get puzzles based on difficulty
  const getPuzzles = () => {
    if (difficulty === 'easy') return easyPuzzles;
    if (difficulty === 'medium') return mediumPuzzles;
    if (difficulty === 'hard') return hardPuzzles;
    return easyPuzzles; // Default to easy
  };
  
  const puzzles = getPuzzles();
  const currentPuzzle = puzzles[currentPuzzleIndex];
  
  // Handle selecting an answer
  const handleSelectAnswer = (answerId: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerId);
    setIsAnswered(true);
    
    const isAnswerCorrect = answerId === currentPuzzle.correctAnswer;
    setIsCorrect(isAnswerCorrect);
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    // Update score
    if (isAnswerCorrect) {
      const pointsPerPuzzle = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
      setScore(prevScore => prevScore + pointsPerPuzzle);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };
  
  // Move to next puzzle
  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
      setShowExplanation(false);
    } else {
      // Game complete
      completeGame();
    }
  };
  
  // Complete the game and update scores
  const completeGame = () => {
    setGameComplete(true);
    
    // Update high score if needed
    const gameId = `logic_puzzles_${difficulty}`;
    setHighScore(gameId, score);
    
    // Award XP
    const baseXP = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40;
    addXP(baseXP);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const handleShowHint = () => {
    setShowHint(true);
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const handleShowExplanation = () => {
    setShowExplanation(true);
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const handlePlayAgain = () => {
    setCurrentPuzzleIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowExplanation(false);
    setScore(0);
    setGameComplete(false);
  };
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.danger;
      default:
        return colors.primary;
    }
  };
  
  const getDifficultyTitle = () => {
    return `Logic Puzzles: ${difficulty?.charAt(0).toUpperCase()}${difficulty?.slice(1)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: getDifficultyTitle(),
          headerBackTitle: 'Back',
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {!gameComplete ? (
          <>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
              </Text>
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
            
            <View style={styles.puzzleContainer}>
              <Text style={styles.question}>{currentPuzzle.question}</Text>
              
              <View style={styles.optionsContainer}>
                {currentPuzzle.options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      selectedAnswer === option.id && styles.selectedOption,
                      isAnswered && option.id === currentPuzzle.correctAnswer && styles.correctOption,
                      isAnswered && selectedAnswer === option.id && option.id !== currentPuzzle.correctAnswer && styles.incorrectOption,
                    ]}
                    onPress={() => handleSelectAnswer(option.id)}
                    disabled={isAnswered}
                  >
                    <Text style={styles.optionLabel}>{option.id.toUpperCase()}.</Text>
                    <Text style={styles.optionText}>{option.text}</Text>
                    {isAnswered && option.id === currentPuzzle.correctAnswer && (
                      <Check size={20} color="#fff" style={styles.optionIcon} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              {!isAnswered && currentPuzzle.hint && (
                <TouchableOpacity style={styles.hintButton} onPress={handleShowHint}>
                  <HelpCircle size={16} color={getDifficultyColor()} />
                  <Text style={[styles.hintButtonText, { color: getDifficultyColor() }]}>
                    Show Hint
                  </Text>
                </TouchableOpacity>
              )}
              
              {showHint && currentPuzzle.hint && (
                <View style={styles.hintContainer}>
                  <Text style={styles.hintTitle}>Hint:</Text>
                  <Text style={styles.hintText}>{currentPuzzle.hint}</Text>
                </View>
              )}
              
              {isAnswered && (
                <View style={styles.feedbackContainer}>
                  <Text style={[
                    styles.feedbackText,
                    isCorrect ? styles.correctFeedback : styles.incorrectFeedback
                  ]}>
                    {isCorrect ? 'Correct!' : 'Incorrect!'}
                  </Text>
                  
                  {!showExplanation && (
                    <TouchableOpacity 
                      style={styles.explanationButton} 
                      onPress={handleShowExplanation}
                    >
                      <Text style={styles.explanationButtonText}>
                        Show Explanation
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  {showExplanation && (
                    <View style={styles.explanationContainer}>
                      <Text style={styles.explanationTitle}>Explanation:</Text>
                      <Text style={styles.explanationText}>
                        {currentPuzzle.explanation}
                      </Text>
                    </View>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.nextButton, { backgroundColor: getDifficultyColor() }]} 
                    onPress={handleNextPuzzle}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentPuzzleIndex < puzzles.length - 1 ? 'Next Puzzle' : 'Complete'}
                    </Text>
                    <ChevronRight size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.completeContainer}>
            <LinearGradient
              colors={['#6C63FF', '#8F8AFF']}
              style={styles.completeIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Brain size={32} color="#fff" />
            </LinearGradient>
            
            <Text style={styles.completeTitle}>Puzzles Complete!</Text>
            
            <View style={styles.completeScoreContainer}>
              <Text style={styles.completeScoreLabel}>Your Score</Text>
              <Text style={styles.completeScoreValue}>{score}</Text>
            </View>
            
            <Text style={styles.completeMessage}>
              {score === puzzles.length * (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12) 
                ? "Perfect score! Your logical reasoning skills are impressive!" 
                : "Great job! Keep practicing to improve your logical reasoning skills."}
            </Text>
            
            <View style={styles.rewardContainer}>
              <View style={styles.rewardItem}>
                <Award size={24} color={colors.primary} />
                <Text style={styles.rewardText}>
                  {difficulty === 'easy' ? '+15 XP' : difficulty === 'medium' ? '+25 XP' : '+40 XP'}
                </Text>
              </View>
              
              <View style={styles.rewardItem}>
                <Brain size={24} color={colors.primary} />
                <Text style={styles.rewardText}>
                  +5 Logic Points
                </Text>
              </View>
            </View>
            
            <View style={styles.completeButtonsContainer}>
              <TouchableOpacity 
                style={[styles.playAgainButton, { borderColor: getDifficultyColor() }]} 
                onPress={handlePlayAgain}
              >
                <Text style={[styles.playAgainButtonText, { color: getDifficultyColor() }]}>
                  Play Again
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.backButton, { backgroundColor: getDifficultyColor() }]} 
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>
                  Back to Games
                </Text>
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
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  puzzleContainer: {
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
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  selectedOption: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  correctOption: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  incorrectOption: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
    width: 24,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  optionIcon: {
    marginLeft: 8,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 8,
  },
  hintButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  hintContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  hintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  feedbackContainer: {
    marginTop: 16,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  correctFeedback: {
    color: colors.success,
  },
  incorrectFeedback: {
    color: colors.danger,
  },
  explanationButton: {
    alignSelf: 'center',
    padding: 8,
    marginBottom: 16,
  },
  explanationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  explanationContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  completeContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  completeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  completeScoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  completeScoreLabel: {
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 4,
  },
  completeScoreValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },
  completeMessage: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  completeButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  playAgainButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
  },
  playAgainButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginLeft: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});