import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Clock, Target, Check } from 'lucide-react-native';

interface FocusFlowGameProps {
  onComplete: (score: number) => void;
}

export const FocusFlowGame: React.FC<FocusFlowGameProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute
  const [isActive, setIsActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [lastAppearTime, setLastAppearTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  const gameAreaRef = useRef<View>(null);
  const [gameAreaSize, setGameAreaSize] = useState({ width: 0, height: 0 });
  
  // Start the game
  const startGame = () => {
    setIsActive(true);
    setClickCount(0);
    setReactionTimes([]);
    moveTarget();
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      endGame();
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  
  // End the game
  const endGame = () => {
    setIsActive(false);
    setGameComplete(true);
    
    // Calculate score based on reaction times and click count
    const score = calculateScore();
    
    setTimeout(() => {
      onComplete(score);
    }, 1500);
  };
  
  // Calculate score
  const calculateScore = () => {
    if (reactionTimes.length === 0) return 0;
    
    // Average reaction time in milliseconds
    const avgReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
    
    // Base score from reaction time (faster = higher score)
    // 1000ms (1 second) = 50 points, 500ms = 75 points, 250ms = 87.5 points
    const baseScore = 100 - (avgReactionTime / 20);
    
    // Bonus for more clicks (each click is worth 5 points)
    const clickBonus = clickCount * 5;
    
    return Math.round(Math.max(0, Math.min(100, baseScore)) + clickBonus);
  };
  
  // Move target to a new random position
  const moveTarget = () => {
    if (!gameAreaSize.width || !gameAreaSize.height) return;
    
    // Calculate safe boundaries to keep target fully within view
    const targetSize = 60; // Target diameter
    const safeWidth = gameAreaSize.width - targetSize;
    const safeHeight = gameAreaSize.height - targetSize;
    
    // Ensure target is at least 20px from edges
    const minDistance = 20;
    const maxWidth = Math.max(0, safeWidth - minDistance * 2);
    const maxHeight = Math.max(0, safeHeight - minDistance * 2);
    
    // Generate random position within safe area
    const x = Math.floor(Math.random() * maxWidth) + minDistance;
    const y = Math.floor(Math.random() * maxHeight) + minDistance;
    
    setTargetPosition({ x, y });
    setLastAppearTime(Date.now());
  };
  
  // Handle target click
  const handleTargetClick = () => {
    if (!isActive) return;
    
    // Calculate reaction time
    const reactionTime = Date.now() - lastAppearTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    
    // Increment click count
    setClickCount(prev => prev + 1);
    
    // Move target to new position
    moveTarget();
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // End game after 3 successful clicks
    if (clickCount + 1 >= 3) {
      endGame();
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Measure game area size
  const onGameAreaLayout = () => {
    if (gameAreaRef.current) {
      gameAreaRef.current.measure((x, y, width, height, pageX, pageY) => {
        setGameAreaSize({ width, height });
      });
    }
  };
  
  return (
    <View style={styles.container}>
      {!isActive && !gameComplete ? (
        <View style={styles.startContainer}>
          <Text style={styles.instructions}>
            Click on the blue circles as quickly as you can when they appear. This tests your reaction time and focus.
          </Text>
          
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.gameHeader}>
            <View style={styles.timerContainer}>
              <Clock size={16} color={colors.neutral} />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Clicks: {clickCount}/3</Text>
            </View>
          </View>
          
          <View 
            ref={gameAreaRef}
            style={styles.gameArea}
            onLayout={onGameAreaLayout}
          >
            {isActive && gameAreaSize.width > 0 && (
              <TouchableOpacity
                style={[
                  styles.target,
                  {
                    left: targetPosition.x,
                    top: targetPosition.y,
                  },
                ]}
                onPress={handleTargetClick}
                activeOpacity={0.8}
              >
                <Target size={24} color="#fff" />
              </TouchableOpacity>
            )}
            
            {gameComplete && (
              <View style={styles.completionOverlay}>
                <View style={styles.completionIcon}>
                  <Check size={32} color="#fff" />
                </View>
                <Text style={styles.completionText}>Great job!</Text>
                {reactionTimes.length > 0 && (
                  <Text style={styles.reactionTimeText}>
                    Average reaction time: {Math.round(reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length)}ms
                  </Text>
                )}
              </View>
            )}
          </View>
        </>
      )}
      
      <Text style={styles.benefitsText}>
        Benefits: Improves focus, reaction time, and attention to visual stimuli
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  startContainer: {
    alignItems: 'center',
  },
  instructions: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  scoreContainer: {
    backgroundColor: colors.primary + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  gameArea: {
    width: '100%',
    height: 300,
    backgroundColor: colors.background,
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  target: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  reactionTimeText: {
    fontSize: 16,
    color: '#fff',
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});