import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { BookOpen, Send, RefreshCw, Sparkles } from 'lucide-react-native';
import { getRandomPrompt } from '@/constants/journal-prompts';
import { useMoodJournalStore } from '@/store/mood-journal-store';
import { useUserStore } from '@/store/user-store';
import { generatePersonalizedPrompt } from '@/utils/ai-service';

interface JournalPromptProps {
  onComplete?: () => void;
}

export const JournalPrompt: React.FC<JournalPromptProps> = ({ onComplete }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  
  const { currentMood, addJournalEntry } = useMoodJournalStore();
  const { addXP, updateStats, profile } = useUserStore();
  const stats = useUserStore((state) => state.stats);

  // Load personalized prompt on component mount
  useEffect(() => {
    loadPersonalizedPrompt();
  }, []);

  const loadPersonalizedPrompt = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate personalized prompt based on user profile and current mood
      const personalizedPrompt = await generatePersonalizedPrompt(profile, currentMood);
      setPrompt(personalizedPrompt);
      setIsAIGenerated(true);
    } catch (err) {
      console.error('Failed to load personalized prompt:', err);
      setError('Could not load a personalized prompt. Using a general one instead.');
      setPrompt(getRandomPrompt());
      setIsAIGenerated(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleSubmit = () => {
    if (response.trim().length === 0) return;
    
    if (currentMood) {
      addJournalEntry({
        mood: currentMood,
        content: response,
        tags: ['journal', 'prompt'],
        isPrivate: true,
      });
      
      // Add XP and update stats
      addXP(15);
      updateStats({
        totalJournalEntries: stats.totalJournalEntries + 1,
      });
      
      // Reset
      setResponse('');
      
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleNewPrompt = async () => {
    setIsRefreshing(true);
    await loadPersonalizedPrompt();
  };

  return (
    <View style={styles.container}>
      <View style={styles.promptHeader}>
        <BookOpen size={20} color={colors.primary} />
        <Text style={styles.promptTitle}>Journal Prompt</Text>
        {isAIGenerated && (
          <View style={styles.aiTag}>
            <Sparkles size={12} color="#fff" />
            <Text style={styles.aiTagText}>AI-Powered</Text>
          </View>
        )}
      </View>
      
      <View style={styles.promptContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>Generating a personalized prompt for you...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.promptText}>{prompt}</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity 
              style={styles.newPromptButton} 
              onPress={handleNewPrompt}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.refreshButtonContent}>
                  <RefreshCw size={14} color={colors.primary} />
                  <Text style={styles.newPromptText}>Try another prompt</Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write your thoughts here..."
          placeholderTextColor={colors.neutral}
          multiline
          value={response}
          onChangeText={setResponse}
          textAlignVertical="top"
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (response.trim().length === 0 || isLoading) && styles.disabledButton
          ]} 
          onPress={handleSubmit}
          disabled={response.trim().length === 0 || isLoading}
        >
          <Send size={20} color="#fff" />
        </TouchableOpacity>
      </View>
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
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  promptContainer: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 120,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    color: colors.neutral,
    textAlign: 'center',
  },
  promptText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 8,
  },
  newPromptButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newPromptText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    maxHeight: 150,
    color: colors.text,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  disabledButton: {
    backgroundColor: colors.neutral,
    opacity: 0.5,
  },
});