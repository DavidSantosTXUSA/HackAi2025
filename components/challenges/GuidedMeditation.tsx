import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Brain, Play, Pause, Clock } from 'lucide-react-native';

interface GuidedMeditationProps {
  steps: Array<{ bodyPart: string; duration: number; instruction: string }>;
  benefits: string;
  onComplete: () => void;
}

export const GuidedMeditation: React.FC<GuidedMeditationProps> = ({
  steps,
  benefits,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0].duration);
  const [totalTime, setTotalTime] = useState(steps.reduce((sum, step) => sum + step.duration, 0));
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const fadeAnim = new Animated.Value(1);
  
  const currentStep = steps[currentStepIndex];
  
  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
        setTotalTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next step when timer completes
      if (currentStepIndex < steps.length - 1) {
        goToNextStep();
      } else {
        // All steps completed
        setIsActive(false);
        setIsComplete(true);
        onComplete();
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
      
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  
  // Fade animation for instruction text
  useEffect(() => {
    if (isActive) {
      // Fade out and in when changing steps
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentStepIndex]);
  
  // Start or pause the meditation
  const toggleActive = () => {
    setIsActive(!isActive);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Go to next step
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setTimeLeft(steps[currentStepIndex + 1].duration);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <Brain size={20} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Body Scan Meditation</Text>
      </View>
      
      {!isComplete ? (
        <>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStepIndex + 1) / steps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStepIndex + 1} of {steps.length}
            </Text>
          </View>
          
          <View style={styles.meditationContainer}>
            <Text style={styles.bodyPartText}>{currentStep.bodyPart}</Text>
            
            <Animated.Text style={[styles.instructionText, { opacity: fadeAnim }]}>
              {currentStep.instruction}
            </Animated.Text>
            
            <View style={styles.timerContainer}>
              <Clock size={16} color={colors.neutral} />
              <Text style={styles.stepTimerText}>{formatTime(timeLeft)}</Text>
              <Text style={styles.totalTimerText}>Total: {formatTime(totalTime)}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.controlButton, isActive && styles.pauseButton]}
              onPress={toggleActive}
            >
              {isActive ? (
                <>
                  <Pause size={20} color="#fff" />
                  <Text style={styles.controlButtonText}>Pause</Text>
                </>
              ) : (
                <>
                  <Play size={20} color="#fff" />
                  <Text style={styles.controlButtonText}>
                    {currentStepIndex === 0 && timeLeft === steps[0].duration ? 'Start' : 'Resume'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.meditationTip}>
            Find a comfortable position and close your eyes. Breathe naturally and follow the guidance.
          </Text>
        </>
      ) : (
        <View style={styles.completionContainer}>
          <View style={styles.completionIcon}>
            <Brain size={32} color="#fff" />
          </View>
          <Text style={styles.completionTitle}>Meditation Complete</Text>
          <Text style={styles.completionText}>
            Well done! You've completed the body scan meditation. Take a moment to notice how you feel now.
          </Text>
        </View>
      )}
      
      <Text style={styles.benefitsText}>Benefits: {benefits}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'right',
  },
  meditationContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  bodyPartText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTimerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
    marginRight: 16,
  },
  totalTimerText: {
    fontSize: 14,
    color: colors.neutral,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  pauseButton: {
    backgroundColor: colors.neutral,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  meditationTip: {
    fontSize: 14,
    color: colors.neutral,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  completionContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  completionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});