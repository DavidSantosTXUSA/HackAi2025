import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useGameStore } from '@/store/game-store';
import { Challenge } from '@/types';
import { Activity, Award, Brain, Check, Clock, Eye, Heart, MessageCircle, Target, Wind, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BreathingExercise } from '@/components/challenges/BreathingExercise';
import { SensoryAwareness } from '@/components/challenges/SensoryAwareness';
import { JournalPromptChallenge } from '@/components/challenges/JournalPromptChallenge';
import { GuidedMovement } from '@/components/challenges/GuidedMovement';
import { WordGame } from '@/components/challenges/WordGame';
import { MessagePrompt } from '@/components/challenges/MessagePrompt';
import { WritingExercise } from '@/components/challenges/WritingExercise';
import { GuidedMeditation } from '@/components/challenges/GuidedMeditation';

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { challenges, completeChallenge } = useGameStore();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundChallenge = challenges.find(c => c.id === id);
      if (foundChallenge) {
        setChallenge(foundChallenge);
        setIsCompleted(foundChallenge.completed);
        setTimeLeft(foundChallenge.duration * 60); // Convert to seconds
      }
    }
  }, [id, challenges]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsCompleted(true);
      if (challenge) {
        completeChallenge(challenge.id);
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
  
  const handleStart = () => {
    setIsActive(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  
  const handleComplete = useCallback(() => {
    if (challenge) {
      completeChallenge(challenge.id);
      setIsCompleted(true);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [challenge, completeChallenge]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getIconForType = () => {
    if (!challenge) return <Target size={24} color="#fff" />;
    
    switch (challenge.type) {
      case 'breathing':
        return <Wind size={24} color="#fff" />;
      case 'mindfulness':
        return <Eye size={24} color="#fff" />;
      case 'gratitude':
        return <Heart size={24} color="#fff" />;
      case 'physical':
        return <Activity size={24} color="#fff" />;
      case 'cognitive':
        return <Brain size={24} color="#fff" />;
      case 'social':
        return <MessageCircle size={24} color="#fff" />;
      default:
        return <Target size={24} color="#fff" />;
    }
  };

  const renderInteractiveContent = () => {
    if (!challenge || !challenge.interactiveContent) return null;

    const content = challenge.interactiveContent;
    
    switch (content.type) {
      case 'breathing-exercise':
        return <BreathingExercise 
          pattern={content.pattern} 
          instructions={content.instructions}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      case 'sensory-awareness':
        return <SensoryAwareness 
          steps={content.steps}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      case 'journal-prompt':
        return <JournalPromptChallenge
          prompts={content.prompts}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      case 'guided-movement':
        return <GuidedMovement
          steps={content.steps}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      case 'word-game':
        return <WordGame
          startWords={content.startWords}
          instructions={content.instructions}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      case 'message-prompt':
        return <MessagePrompt
          prompts={content.prompts}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      case 'writing-exercise':
        return <WritingExercise
          prompts={content.prompts}
          template={content.template}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      case 'guided-meditation':
        return <GuidedMeditation
          steps={content.steps}
          benefits={content.benefits}
          onComplete={handleComplete}
        />;
      default:
        return (
          <View style={styles.defaultInteractiveContent}>
            <Text style={styles.defaultInteractiveText}>
              Follow the timer to complete this challenge.
            </Text>
          </View>
        );
    }
  };
  
  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Challenge not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Stack.Screen 
        options={{
          title: challenge.title,
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
          {getIconForType()}
        </LinearGradient>
        
        <Text style={styles.title}>{challenge.title}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={16} color={colors.neutral} />
            <Text style={styles.infoText}>{challenge.duration} min</Text>
          </View>
          <View style={styles.infoItem}>
            <Award size={16} color={colors.neutral} />
            <Text style={styles.infoText}>{challenge.points} XP</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{challenge.description}</Text>
        
        {isCompleted ? (
          <View style={styles.completedContainer}>
            <View style={styles.completedBadge}>
              <Check size={32} color="#fff" />
            </View>
            <Text style={styles.completedText}>Challenge Completed!</Text>
            <Text style={styles.completedSubtext}>
              You've earned {challenge.points} XP for completing this challenge.
            </Text>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Back to Activities</Text>
            </TouchableOpacity>
          </View>
        ) : isActive ? (
          <>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Time Remaining</Text>
              <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${(timeLeft / (challenge.duration * 60)) * 100}%` }
                  ]} 
                />
              </View>
            </View>
            
            {renderInteractiveContent()}
            
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleComplete}
            >
              <Text style={styles.buttonText}>Complete Challenge</Text>
              <Check size={20} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStart}
            >
              <Text style={styles.buttonText}>Start Challenge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  timerLabel: {
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 8,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  actionContainer: {
    width: '100%',
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    flexDirection: 'row',
  },
  completeButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexDirection: 'row',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
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
  completedContainer: {
    alignItems: 'center',
    width: '100%',
  },
  completedBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  defaultInteractiveContent: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
  },
  defaultInteractiveText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
});