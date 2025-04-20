import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface BreathingExerciseProps {
  pattern: string;
  instructions: string;
  benefits: string;
  onComplete: () => void;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  pattern,
  instructions,
  benefits,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  const circleSize = useRef(new Animated.Value(100)).current;
  const circleOpacity = useRef(new Animated.Value(0.5)).current;
  
  // Parse pattern timings
  const getPatternTimings = () => {
    if (pattern === '4-7-8') {
      return { inhale: 4, hold1: 7, exhale: 8 };
    } else if (pattern === 'box') {
      return { inhale: 4, hold1: 4, exhale: 4, hold2: 4 };
    } else {
      // Default pattern
      return { inhale: 4, hold1: 0, exhale: 4, hold2: 0 };
    }
  };
  
  const timings = getPatternTimings();
  
  // Start breathing animation
  useEffect(() => {
    startBreathingCycle();
    
    // Haptic feedback at the start
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    return () => {
      // Clean up animations
      circleSize.stopAnimation();
      circleOpacity.stopAnimation();
    };
  }, []);
  
  // Update phase timer
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseTime(prev => prev + 1);
      setTotalTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check phase transition
  useEffect(() => {
    const currentPhaseTime = 
      phase === 'inhale' ? timings.inhale :
      phase === 'hold1' ? timings.hold1 :
      phase === 'exhale' ? timings.exhale :
      timings.hold2;
    
    if (phaseTime >= currentPhaseTime) {
      setPhaseTime(0);
      
      // Transition to next phase
      if (phase === 'inhale') {
        if (timings.hold1) {
          setPhase('hold1');
          animateHold1();
        } else {
          setPhase('exhale');
          animateExhale();
        }
      } else if (phase === 'hold1') {
        setPhase('exhale');
        animateExhale();
      } else if (phase === 'exhale') {
        if (timings.hold2) {
          setPhase('hold2');
          animateHold2();
        } else {
          // Complete one breath cycle
          const newCycleCount = cycleCount + 1;
          setCycleCount(newCycleCount);
          
          if (newCycleCount >= 5) {
            // Exercise complete after 5 cycles
            onComplete();
          } else {
            setPhase('inhale');
            animateInhale();
          }
        }
      } else if (phase === 'hold2') {
        // Complete one breath cycle
        const newCycleCount = cycleCount + 1;
        setCycleCount(newCycleCount);
        
        if (newCycleCount >= 5) {
          // Exercise complete after 5 cycles
          onComplete();
        } else {
          setPhase('inhale');
          animateInhale();
        }
      }
      
      // Haptic feedback on phase change
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [phaseTime, phase]);
  
  // Start breathing cycle
  const startBreathingCycle = () => {
    setPhase('inhale');
    animateInhale();
  };
  
  // Animate inhale phase
  const animateInhale = () => {
    Animated.timing(circleSize, {
      toValue: 200,
      duration: timings.inhale * 1000,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
    
    Animated.timing(circleOpacity, {
      toValue: 0.8,
      duration: timings.inhale * 1000,
      useNativeDriver: false,
    }).start();
  };
  
  // Animate hold after inhale
  const animateHold1 = () => {
    Animated.timing(circleSize, {
      toValue: 200,
      duration: timings.hold1 * 1000,
      useNativeDriver: false,
    }).start();
  };
  
  // Animate exhale phase
  const animateExhale = () => {
    Animated.timing(circleSize, {
      toValue: 100,
      duration: timings.exhale * 1000,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
    
    Animated.timing(circleOpacity, {
      toValue: 0.5,
      duration: timings.exhale * 1000,
      useNativeDriver: false,
    }).start();
  };
  
  // Animate hold after exhale
  const animateHold2 = () => {
    Animated.timing(circleSize, {
      toValue: 100,
      duration: timings.hold2 * 1000,
      useNativeDriver: false,
    }).start();
  };
  
  // Get instruction text based on current phase
  const getInstructionText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale slowly...';
      case 'hold1':
        return 'Hold your breath...';
      case 'exhale':
        return 'Exhale slowly...';
      case 'hold2':
        return 'Hold...';
      default:
        return 'Get ready...';
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.patternName}>{pattern} Breathing</Text>
      <Text style={styles.instructions}>{instructions}</Text>
      
      <View style={styles.breathingContainer}>
        <Animated.View
          style={[
            styles.breathCircle,
            {
              width: circleSize,
              height: circleSize,
              opacity: circleOpacity,
            },
          ]}
        />
        
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>{getInstructionText()}</Text>
          <Text style={styles.cycleText}>Cycle {cycleCount + 1} of 5</Text>
        </View>
      </View>
      
      <View style={styles.phaseTimerContainer}>
        <View style={styles.phaseTimer}>
          <View 
            style={[
              styles.phaseTimerFill,
              {
                width: `${(phaseTime / (
                  phase === 'inhale' ? timings.inhale :
                  phase === 'hold1' ? timings.hold1 :
                  phase === 'exhale' ? timings.exhale :
                  timings.hold2
                )) * 100}%`
              }
            ]}
          />
        </View>
      </View>
      
      <Text style={styles.benefitsText}>Benefits: {benefits}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  patternName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: '100%',
    marginBottom: 16,
  },
  breathCircle: {
    borderRadius: 150,
    backgroundColor: colors.primary + '40',
    borderWidth: 2,
    borderColor: colors.primary,
    position: 'absolute',
  },
  instructionContainer: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  cycleText: {
    fontSize: 14,
    color: colors.neutral,
  },
  phaseTimerContainer: {
    width: '80%',
    marginBottom: 24,
  },
  phaseTimer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  phaseTimerFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});