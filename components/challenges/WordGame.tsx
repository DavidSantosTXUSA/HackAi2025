import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Brain, Send, Check, RefreshCw } from 'lucide-react-native';

interface WordGameProps {
  startWords: string[];
  instructions: string;
  benefits: string;
  onComplete: () => void;
}

export const WordGame: React.FC<WordGameProps> = ({
  startWords,
  instructions,
  benefits,
  onComplete,
}) => {
  const [currentWord, setCurrentWord] = useState('');
  const [wordChain, setWordChain] = useState<string[]>([]);
  const [startWord, setStartWord] = useState('');
  const [inputWord, setInputWord] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  const inputRef = useRef<TextInput>(null);
  
  // Initialize with a random start word
  useEffect(() => {
    getRandomStartWord();
  }, []);
  
  // Get a random start word
  const getRandomStartWord = () => {
    const randomIndex = Math.floor(Math.random() * startWords.length);
    const word = startWords[randomIndex];
    setStartWord(word);
    setWordChain([word]);
    setCurrentWord(word);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Submit a word
  const submitWord = () => {
    if (!inputWord.trim()) return;
    
    // Check if the word is related to the current word
    // In a real app, you might use an API to check word associations
    // For this example, we'll just accept any word
    
    setWordChain([...wordChain, inputWord]);
    setCurrentWord(inputWord);
    setInputWord('');
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    // Check if chain is complete (10 words)
    if (wordChain.length >= 9) {
      setIsComplete(true);
      onComplete();
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <Brain size={20} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Word Association</Text>
      </View>
      
      <Text style={styles.instructions}>{instructions}</Text>
      
      <View style={styles.gameContainer}>
        <View style={styles.wordChainContainer}>
          <Text style={styles.wordChainLabel}>Your word chain ({wordChain.length}/10):</Text>
          
          <FlatList
            data={wordChain}
            renderItem={({ item, index }) => (
              <View style={styles.chainItem}>
                <Text style={styles.chainNumber}>{index + 1}.</Text>
                <Text style={styles.chainWord}>{item}</Text>
                {index > 0 && (
                  <View style={styles.checkIcon}>
                    <Check size={16} color={colors.success} />
                  </View>
                )}
              </View>
            )}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={styles.chainList}
          />
        </View>
        
        {!isComplete && (
          <>
            <View style={styles.currentWordContainer}>
              <Text style={styles.currentWordLabel}>Current word:</Text>
              <Text style={styles.currentWord}>{currentWord}</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputWord}
                onChangeText={setInputWord}
                placeholder="Type a related word..."
                onSubmitEditing={submitWord}
                autoCapitalize="none"
              />
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !inputWord.trim() && styles.disabledButton
                ]}
                onPress={submitWord}
                disabled={!inputWord.trim()}
              >
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.newWordButton} onPress={getRandomStartWord}>
              <RefreshCw size={16} color={colors.primary} />
              <Text style={styles.newWordButtonText}>Try a different starting word</Text>
            </TouchableOpacity>
          </>
        )}
        
        {isComplete && (
          <View style={styles.completionContainer}>
            <Text style={styles.completionText}>
              Great job! You've completed a chain of 10 associated words.
            </Text>
          </View>
        )}
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
  instructions: {
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 16,
    lineHeight: 20,
  },
  gameContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  wordChainContainer: {
    marginBottom: 16,
  },
  wordChainLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  chainList: {
    maxHeight: 150,
  },
  chainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  chainNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    width: 24,
  },
  chainWord: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 8,
  },
  currentWordContainer: {
    marginBottom: 16,
  },
  currentWordLabel: {
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 4,
  },
  currentWord: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  newWordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newWordButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  completionContainer: {
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  completionText: {
    fontSize: 16,
    color: colors.success,
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