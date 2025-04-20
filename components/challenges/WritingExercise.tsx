import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Pen, Send, Copy, Check, ChevronRight, ChevronLeft } from 'lucide-react-native';

interface WritingExerciseProps {
  prompts: string[];
  template: string;
  benefits: string;
  onComplete: () => void;
}

export const WritingExercise: React.FC<WritingExerciseProps> = ({
  prompts,
  template,
  benefits,
  onComplete,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>(Array(prompts.length).fill(''));
  const [showTemplate, setShowTemplate] = useState(false);
  const [finalNote, setFinalNote] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Get current prompt
  const currentPrompt = prompts[currentPromptIndex];
  
  // Go to next prompt
  const goToNextPrompt = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      // All prompts answered, show template
      setShowTemplate(true);
      
      // Pre-fill template with responses
      let filledTemplate = template;
      if (responses[0]) filledTemplate = filledTemplate.replace('[what they did]', responses[0]);
      if (responses[1]) filledTemplate = filledTemplate.replace('[specific action]', responses[1]);
      if (responses[2]) filledTemplate = filledTemplate.replace('[how it affected you]', responses[2]);
      if (responses[3]) filledTemplate = filledTemplate.replace('[quality]', responses[3]);
      
      setFinalNote(filledTemplate);
    }
  };
  
  // Go to previous prompt
  const goToPrevPrompt = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (showTemplate) {
      setShowTemplate(false);
      setCurrentPromptIndex(prompts.length - 1);
    }
  };
  
  // Update response for current prompt
  const updateResponse = (text: string) => {
    const newResponses = [...responses];
    newResponses[currentPromptIndex] = text;
    setResponses(newResponses);
  };
  
  // Copy final note to clipboard
  const copyFinalNote = () => {
    // In a real app, you would use Clipboard.setString(finalNote)
    // For this example, we'll just simulate copying
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  // Complete the exercise
  const completeExercise = () => {
    setIsComplete(true);
    onComplete();
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <Pen size={20} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Thank You Note</Text>
      </View>
      
      {!isComplete ? (
        <>
          {!showTemplate ? (
            <View style={styles.promptContainer}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((currentPromptIndex + 1) / prompts.length) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  Question {currentPromptIndex + 1} of {prompts.length}
                </Text>
              </View>
              
              <Text style={styles.promptText}>{currentPrompt}</Text>
              
              <TextInput
                style={styles.responseInput}
                value={responses[currentPromptIndex]}
                onChangeText={updateResponse}
                placeholder="Write your answer here..."
                multiline
                textAlignVertical="top"
              />
              
              <View style={styles.navigationContainer}>
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    currentPromptIndex === 0 && styles.disabledButton
                  ]}
                  onPress={goToPrevPrompt}
                  disabled={currentPromptIndex === 0}
                >
                  <ChevronLeft size={20} color={colors.text} />
                  <Text style={styles.navButtonText}>Previous</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.navButton,
                    styles.nextButton,
                    !responses[currentPromptIndex]?.trim() && styles.disabledButton
                  ]}
                  onPress={goToNextPrompt}
                  disabled={!responses[currentPromptIndex]?.trim()}
                >
                  <Text style={styles.nextButtonText}>
                    {currentPromptIndex < prompts.length - 1 ? 'Next' : 'Create Note'}
                  </Text>
                  <ChevronRight size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.templateContainer}>
              <Text style={styles.templateTitle}>Your Thank You Note</Text>
              
              <TextInput
                style={styles.noteInput}
                value={finalNote}
                onChangeText={setFinalNote}
                multiline
                textAlignVertical="top"
              />
              
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={goToPrevPrompt}
                >
                  <ChevronLeft size={20} color={colors.text} />
                  <Text style={styles.backButtonText}>Edit Answers</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.copyButton,
                    !finalNote.trim() && styles.disabledButton
                  ]}
                  onPress={copyFinalNote}
                  disabled={!finalNote.trim()}
                >
                  {isCopied ? (
                    <Check size={20} color={colors.primary} />
                  ) : (
                    <Copy size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  !finalNote.trim() && styles.disabledButton
                ]}
                onPress={completeExercise}
                disabled={!finalNote.trim()}
              >
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.completionContainer}>
          <View style={styles.completionIcon}>
            <Check size={32} color="#fff" />
          </View>
          <Text style={styles.completionTitle}>Note Created!</Text>
          <Text style={styles.completionText}>
            You've written a thoughtful thank you note. Expressing gratitude is a powerful way to improve your well-being and strengthen relationships.
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
  promptContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.card,
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
  promptText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  responseInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    marginBottom: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginRight: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  templateContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  noteInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    minHeight: 200,
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: colors.success,
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