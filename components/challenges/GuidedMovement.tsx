import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Activity, ChevronRight, ChevronLeft, Clock } from 'lucide-react-native';

interface GuidedMovementProps {
  steps: Array<{ position: string; duration: number; instruction: string }>;
  benefits: string;
  onComplete: () => void;
}

export const GuidedMovement: React.FC<GuidedMovementProps> = ({
  steps,
  benefits,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0].duration);
  const [isActive, setIsActive] = useState(false);
  
  const currentStep = steps[currentStepIndex];
  
  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next step when timer completes
      if (currentStepIndex < steps.length - 1) {
        goToNextStep();
      } else {
        // All steps completed
        setIsActive(false);
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
  
  // Start or pause the exercise
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
  
  // Go to previous step
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setTimeLeft(steps[currentStepIndex - 1].duration);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Get image for position (placeholder URLs)
  const getPositionImage = (position: string) => {
    const positionMap: Record<string, string> = {
      'Neck Rolls': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&q=80&auto=format',
      'Shoulder Stretch': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80&auto=format',
      'Side Stretch': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80&auto=format',
      'Forward Fold': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80&auto=format',
      'Gentle Twist': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80&auto=format',
      'Wonder Woman': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80&auto=format',
      'Victory': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80&auto=format',
    };
    
    return positionMap[position] || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80&auto=format';
  };
  
  return (
    <View style={styles.container}>
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
          Position {currentStepIndex + 1} of {steps.length}
        </Text>
      </View>
      
      <View style={styles.positionContainer}>
        <Text style={styles.positionName}>{currentStep.position}</Text>
        
        <Image
          source={{ uri: getPositionImage(currentStep.position) }}
          style={styles.positionImage}
          resizeMode="cover"
        />
        
        <Text style={styles.instruction}>{currentStep.instruction}</Text>
        
        <View style={styles.timerContainer}>
          <Clock size={16} color={colors.neutral} />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.prevButton]}
            onPress={goToPrevStep}
            disabled={currentStepIndex === 0}
          >
            <ChevronLeft size={24} color={currentStepIndex === 0 ? colors.neutral : colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton, isActive && styles.pauseButton]}
            onPress={toggleActive}
          >
            <Text style={styles.playButtonText}>
              {isActive ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.nextButton]}
            onPress={goToNextStep}
            disabled={currentStepIndex === steps.length - 1}
          >
            <ChevronRight size={24} color={currentStepIndex === steps.length - 1 ? colors.neutral : colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.benefitsText}>Benefits: {benefits}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
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
  positionContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  positionName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  positionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: colors.background,
  },
  instruction: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: colors.background,
  },
  nextButton: {
    backgroundColor: colors.background,
  },
  playButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    width: 'auto',
  },
  pauseButton: {
    backgroundColor: colors.neutral,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});