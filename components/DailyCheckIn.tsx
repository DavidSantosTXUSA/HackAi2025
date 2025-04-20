import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { MoodSelector } from './MoodSelector';
import { JournalPrompt } from './JournalPrompt';
import { VoiceRecorder } from './VoiceRecorder';
import { AffirmationModal } from './AffirmationModal';
import { useMoodJournalStore } from '@/store/mood-journal-store';
import { useUserStore } from '@/store/user-store';
import { useGameStore } from '@/store/game-store';
import { Mood } from '@/types';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { CheckCircle, Mic, Sparkles } from 'lucide-react-native';

export const DailyCheckIn: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showAffirmationModal, setShowAffirmationModal] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  
  const { 
    setCurrentMood, 
    currentMood, 
    addVoiceRecording, 
    getPositiveAffirmations 
  } = useMoodJournalStore();
  
  const { streak, updateStreak, addXP, profile } = useUserStore();
  const { checkAchievementProgress } = useGameStore();
  
  const positiveAffirmations = getPositiveAffirmations(1);
  
  // Check if user has already completed a check-in today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (streak.lastCheckIn === today) {
      setIsComplete(true);
    }
  }, [streak.lastCheckIn]);
  
  const handleMoodSelect = (mood: Mood) => {
    setCurrentMood(mood);
    
    // Check if the mood is sad or anxious and we have positive affirmations
    if ((mood.id === 'sad' || mood.id === 'anxious') && positiveAffirmations.length > 0) {
      setShowAffirmationModal(true);
    } else {
      setIsGeneratingPrompt(true);
      setStep(2);
    }
  };
  
  const handleJournalComplete = () => {
    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = streak.lastCheckIn;
    
    let newStreak = streak.currentStreak;
    
    // If this is the first check-in or it's a new day
    if (!lastCheckIn || lastCheckIn !== today) {
      // Check if the streak is continuous (yesterday or first time)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];
      
      if (!lastCheckIn || lastCheckIn === yesterdayString) {
        // Continuous streak
        newStreak += 1;
      } else {
        // Broken streak, start over
        newStreak = 1;
      }
      
      updateStreak({
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastCheckIn: today,
      });
    }
    
    // Add XP for completing check-in
    addXP(25);
    
    // Check achievements
    checkAchievementProgress();
    
    // Mark as complete
    setIsComplete(true);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const handleRecordingComplete = (uri: string, duration: number) => {
    if (currentMood) {
      // Add the voice recording
      const recordingId = addVoiceRecording({
        uri,
        duration,
        moodId: currentMood.id,
        isPositiveAffirmation: true,
        title: `Affirmation (${currentMood.name})`,
      });
      
      // Add XP for recording an affirmation
      addXP(10);
      
      // Hide recorder
      setShowRecorder(false);
      
      // Continue to next step
      setIsGeneratingPrompt(true);
      setStep(2);
    }
  };
  
  const handleReset = () => {
    setStep(1);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <View style={styles.completeContainer}>
        <View style={styles.completeContent}>
          <CheckCircle size={48} color={colors.success} />
          <Text style={styles.completeTitle}>Check-in Complete!</Text>
          <Text style={styles.completeText}>
            You've earned 25 XP and added to your streak of {streak.currentStreak} days.
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Check In Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Daily Check-In</Text>
        {step === 2 && (
          <View style={styles.aiPoweredBadge}>
            <Sparkles size={14} color={colors.primary} />
            <Text style={styles.aiPoweredText}>AI-Powered</Text>
          </View>
        )}
      </View>
      
      {step === 1 && (
        <>
          <MoodSelector 
            onSelectMood={handleMoodSelect} 
            selectedMood={currentMood}
          />
          
          {currentMood && (
            <TouchableOpacity 
              style={styles.recordButton}
              onPress={() => setShowRecorder(true)}
            >
              <Mic size={16} color={colors.primary} />
              <Text style={styles.recordButtonText}>
                Record a positive affirmation
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
      
      {step === 2 && (
        <JournalPrompt onComplete={handleJournalComplete} />
      )}
      
      {showRecorder && (
        <Modal
          visible={showRecorder}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRecorder(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.recorderContainer}>
              <VoiceRecorder 
                onRecordingComplete={handleRecordingComplete}
                onCancel={() => setShowRecorder(false)}
              />
            </View>
          </View>
        </Modal>
      )}
      
      {showAffirmationModal && positiveAffirmations.length > 0 && (
        <AffirmationModal
          visible={showAffirmationModal}
          onClose={() => {
            setShowAffirmationModal(false);
            setIsGeneratingPrompt(true);
            setStep(2);
          }}
          recording={positiveAffirmations[0]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  aiPoweredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiPoweredText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '15',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  recordButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  completeContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  completeContent: {
    alignItems: 'center',
  },
  completeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  completeText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  recorderContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
});