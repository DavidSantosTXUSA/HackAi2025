import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { BookOpen, Send, Heart, RefreshCw } from 'lucide-react-native';

interface JournalPromptChallengeProps {
  prompts: string[];
  benefits: string;
  onComplete: () => void;
}

export const JournalPromptChallenge: React.FC<JournalPromptChallengeProps> = ({
  prompts,
  benefits,
  onComplete,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [completedPrompts, setCompletedPrompts] = useState<number[]>([]);
  
  // Get current prompt
  const currentPrompt = prompts[currentPromptIndex];
  
  // Change to next prompt
  const changePrompt = () => {
    const nextIndex = (currentPromptIndex + 1) % prompts.length;
    setCurrentPromptIndex(nextIndex);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Submit response
  const submitResponse = () => {
    if (response.trim().length === 0) return;
    
    // Mark prompt as completed
    setCompletedPrompts([...completedPrompts, currentPromptIndex]);
    
    // Clear response
    setResponse('');
    
    // Change to next prompt if there are more
    if (completedPrompts.length + 1 < 3) {
      // Find an uncompleted prompt
      let nextIndex = (currentPromptIndex + 1) % prompts.length;
      while (completedPrompts.includes(nextIndex)) {
        nextIndex = (nextIndex + 1) % prompts.length;
      }
      setCurrentPromptIndex(nextIndex);
    } else {
      // All required prompts completed
      onComplete();
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <BookOpen size={20} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Gratitude Journal</Text>
        <Text style={styles.promptCounter}>
          {completedPrompts.length}/3 completed
        </Text>
      </View>
      
      <View style={styles.promptContainer}>
        <Text style={styles.promptText}>{currentPrompt}</Text>
        <TouchableOpacity style={styles.changePromptButton} onPress={changePrompt}>
          <RefreshCw size={16} color={colors.primary} />
          <Text style={styles.changePromptText}>Try another prompt</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.responseContainer}>
        <TextInput
          style={styles.responseInput}
          value={response}
          onChangeText={setResponse}
          placeholder="Write your thoughts here..."
          multiline
          textAlignVertical="top"
        />
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            response.trim().length === 0 && styles.disabledButton
          ]}
          onPress={submitResponse}
          disabled={response.trim().length === 0}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {completedPrompts.length > 0 && (
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Completed Reflections:</Text>
          <View style={styles.completedBadges}>
            {completedPrompts.map((promptIndex) => (
              <View key={promptIndex} style={styles.completedBadge}>
                <Heart size={16} color="#fff" />
              </View>
            ))}
          </View>
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
    flex: 1,
  },
  promptCounter: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  promptContainer: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  promptText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  changePromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  changePromptText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  responseContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  responseInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    maxHeight: 200,
    fontSize: 16,
    marginRight: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  disabledButton: {
    opacity: 0.5,
  },
  completedContainer: {
    marginBottom: 16,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  completedBadges: {
    flexDirection: 'row',
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});