import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Wind, Pause, Play } from 'lucide-react-native';

interface BreathPacerGameProps {
  onComplete: (score: number) => void;
}

type BreathingPattern = {
  name: string;
  description: string;
  inhale: number;
  hold1?: number;
  exhale: number;
  hold2?: number;
  color: string;
  benefits: string;
};

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Box Breathing",
    description: "Inhale, hold, exhale, hold - all for equal counts",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: colors.primary,
    benefits: "Used by Navy SEALs to reduce stress and improve focus"
  },
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    color: colors.secondary,
    benefits: "Helps with anxiety, sleep, and stress management"
  },
  {
    name: "Calm Breathing",
    description: "Gentle inhale and longer exhale",
    inhale: 4,
    exhale: 6,
    color: colors.tertiary,
    benefits: "Activates the parasympathetic nervous system for relaxation"
  }
];

export const BreathPacerGame: React.FC<BreathPacerGameProps> = ({ onComplete }) => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  
  const circleSize = useRef(new Animated.Value(100)).current;
  const circleOpacity = useRef(new Animated.Value(0.5)).current;
  
  // Calculate total cycle time
  const getCycleTime = (pattern: BreathingPattern) => {
    return (pattern.inhale + (pattern.hold1 || 0) + pattern.exhale + (pattern.hold2 || 0));
  };
  
  // Start breathing animation
  const startBreathing = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setIsBreathing(true);
    setPhase('inhale');
    setPhaseTime(0);
    animateInhale();
  };
  
  // Pause breathing
  const pauseBreathing = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setIsBreathing(false);
  };
  
  // Animate inhale phase
  const animateInhale = () => {
    setPhase('inhale');
    Animated.timing(circleSize, {
      toValue: 200,
      duration: selectedPattern.inhale * 1000,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      if (selectedPattern.hold1) {
        animateHold1();
      } else {
        animateExhale();
      }
    });
    
    Animated.timing(circleOpacity, {
      toValue: 0.8,
      duration: selectedPattern.inhale * 1000,
      useNativeDriver: false,
    }).start();
  };
  
  // Animate hold after inhale
  const animateHold1 = () => {
    setPhase('hold1');
    Animated.timing(circleSize, {
      toValue: 200,
      duration: (selectedPattern.hold1 || 0) * 1000,
      useNativeDriver: false,
    }).start(() => {
      animateExhale();
    });
  };
  
  // Animate exhale phase
  const animateExhale = () => {
    setPhase('exhale');
    Animated.timing(circleSize, {
      toValue: 100,
      duration: selectedPattern.exhale * 1000,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      if (selectedPattern.hold2) {
        animateHold2();
      } else {
        // Complete one breath cycle
        setBreathCount(prev => prev + 1);
        animateInhale();
      }
    });
    
    Animated.timing(circleOpacity, {
      toValue: 0.5,
      duration: selectedPattern.exhale * 1000,
      useNativeDriver: false,
    }).start();
  };
  
  // Animate hold after exhale
  const animateHold2 = () => {
    setPhase('hold2');
    Animated.timing(circleSize, {
      toValue: 100,
      duration: (selectedPattern.hold2 || 0) * 1000,
      useNativeDriver: false,
    }).start(() => {
      // Complete one breath cycle
      setBreathCount(prev => prev + 1);
      animateInhale();
    });
  };
  
  // Update phase timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isBreathing) {
      interval = setInterval(() => {
        setPhaseTime(prev => prev + 1);
        setTotalTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathing]);
  
  // Check phase transition
  useEffect(() => {
    if (!isBreathing) return;
    
    const currentPhaseTime = 
      phase === 'inhale' ? selectedPattern.inhale :
      phase === 'hold1' ? (selectedPattern.hold1 || 0) :
      phase === 'exhale' ? selectedPattern.exhale :
      (selectedPattern.hold2 || 0);
    
    if (phaseTime >= currentPhaseTime) {
      setPhaseTime(0);
    }
  }, [phaseTime, phase, isBreathing]);
  
  // Complete game after 10 breath cycles
  useEffect(() => {
    if (breathCount >= 10) {
      setIsBreathing(false);
      
      // Calculate score based on total time and consistency
      const idealTime = 10 * getCycleTime(selectedPattern);
      const timeDifference = Math.abs(totalTime - idealTime);
      const timeScore = Math.max(100 - (timeDifference * 2), 50);
      
      onComplete(Math.round(timeScore));
    }
  }, [breathCount]);
  
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
      <Text style={styles.title}>{selectedPattern.name}</Text>
      <Text style={styles.description}>{selectedPattern.description}</Text>
      
      <View style={styles.patternSelector}>
        {breathingPatterns.map((pattern) => (
          <TouchableOpacity
            key={pattern.name}
            style={[
              styles.patternButton,
              selectedPattern.name === pattern.name && styles.selectedPattern,
              { borderColor: pattern.color }
            ]}
            onPress={() => {
              if (!isBreathing) {
                setSelectedPattern(pattern);
                setBreathCount(0);
                setTotalTime(0);
              }
            }}
            disabled={isBreathing}
          >
            <Text style={[
              styles.patternButtonText,
              selectedPattern.name === pattern.name && { color: pattern.color }
            ]}>
              {pattern.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.breathingContainer}>
        <Animated.View
          style={[
            styles.breathCircle,
            {
              width: circleSize,
              height: circleSize,
              opacity: circleOpacity,
              backgroundColor: selectedPattern.color + '40',
              borderColor: selectedPattern.color,
            },
          ]}
        />
        
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>{getInstructionText()}</Text>
          <Text style={styles.breathCountText}>Breath cycles: {breathCount}/10</Text>
        </View>
      </View>
      
      <View style={styles.controlsContainer}>
        {!isBreathing ? (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: selectedPattern.color }]}
            onPress={startBreathing}
          >
            <Play size={24} color="#fff" />
            <Text style={styles.controlButtonText}>Start Breathing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.neutral }]}
            onPress={pauseBreathing}
          >
            <Pause size={24} color="#fff" />
            <Text style={styles.controlButtonText}>Pause</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.benefitsText}>
        Benefits: {selectedPattern.benefits}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 24,
  },
  patternSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  patternButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral,
  },
  selectedPattern: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  patternButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: '100%',
    marginBottom: 24,
  },
  breathCircle: {
    borderRadius: 150,
    borderWidth: 2,
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
  breathCountText: {
    fontSize: 14,
    color: colors.neutral,
  },
  controlsContainer: {
    marginBottom: 24,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});