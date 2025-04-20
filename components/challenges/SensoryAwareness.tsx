import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Eye, Ear, Hand, Coffee, ChevronRight, Check } from 'lucide-react-native';

interface SensoryAwarenessProps {
  steps: Array<{ sense: string; count: number; instruction: string }>;
  benefits: string;
  onComplete: () => void;
}

export const SensoryAwareness: React.FC<SensoryAwarenessProps> = ({
  steps,
  benefits,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [observations, setObservations] = useState<string[][]>([]);
  const [isStepComplete, setIsStepComplete] = useState(false);
  
  // Initialize observations array when steps prop changes
  useEffect(() => {
    if (steps && steps.length > 0) {
      // Initialize with empty arrays for each step
      const initialObservations = steps.map(step => Array(step.count).fill(''));
      setObservations(initialObservations);
    }
  }, [steps]);
  
  // Ensure we have valid steps before proceeding
  if (!steps || steps.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading exercise...</Text>
      </View>
    );
  }
  
  // Get current step safely
  const currentStep = steps[currentStepIndex] || steps[0];
  
  // Check if current step is complete
  useEffect(() => {
    if (observations.length > 0 && currentStepIndex < observations.length) {
      const stepObservations = observations[currentStepIndex];
      const filledObservations = stepObservations.filter(obs => obs.trim() !== '');
      setIsStepComplete(filledObservations.length === currentStep.count);
    }
  }, [observations, currentStepIndex, currentStep]);
  
  // Update observation
  const updateObservation = (index: number, text: string) => {
    if (observations.length === 0) return;
    
    const newObservations = [...observations];
    if (newObservations[currentStepIndex]) {
      newObservations[currentStepIndex][index] = text;
      setObservations(newObservations);
    }
  };
  
  // Move to next step
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // All steps completed
      onComplete();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  // Get icon for sense
  const getSenseIcon = (sense: string) => {
    switch (sense) {
      case 'see':
        return <Eye size={24} color={colors.primary} />;
      case 'hear':
        return <Ear size={24} color={colors.primary} />;
      case 'touch':
        return <Hand size={24} color={colors.primary} />;
      case 'smell':
      case 'taste':
        return <Coffee size={24} color={colors.primary} />;
      default:
        return <Eye size={24} color={colors.primary} />;
    }
  };
  
  // Safely access observations
  const getObservation = (stepIndex: number, obsIndex: number) => {
    if (observations.length > stepIndex && 
        observations[stepIndex] && 
        observations[stepIndex].length > obsIndex) {
      return observations[stepIndex][obsIndex];
    }
    return '';
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
          Step {currentStepIndex + 1} of {steps.length}
        </Text>
      </View>
      
      <View style={styles.stepContainer}>
        <View style={styles.stepHeader}>
          {getSenseIcon(currentStep.sense)}
          <Text style={styles.stepTitle}>
            {currentStep.count} things you can {currentStep.sense}
          </Text>
        </View>
        
        <Text style={styles.instruction}>{currentStep.instruction}</Text>
        
        <ScrollView style={styles.observationsContainer}>
          {Array.from({ length: currentStep.count }).map((_, index) => (
            <View key={index} style={styles.observationItem}>
              <Text style={styles.observationNumber}>{index + 1}.</Text>
              <TextInput
                style={styles.observationInput}
                value={getObservation(currentStepIndex, index)}
                onChangeText={(text) => updateObservation(index, text)}
                placeholder={`Something you can ${currentStep.sense}...`}
              />
              {getObservation(currentStepIndex, index).trim() !== '' && (
                <View style={styles.checkIcon}>
                  <Check size={16} color={colors.success} />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            !isStepComplete && styles.disabledButton
          ]}
          onPress={goToNextStep}
          disabled={!isStepComplete}
        >
          <Text style={styles.nextButtonText}>
            {currentStepIndex < steps.length - 1 ? 'Next Step' : 'Complete'}
          </Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
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
  loadingText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    padding: 20,
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
  stepContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  instruction: {
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 16,
  },
  observationsContainer: {
    maxHeight: 240,
    marginBottom: 16,
  },
  observationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  observationNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: 24,
  },
  observationInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  checkIcon: {
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});