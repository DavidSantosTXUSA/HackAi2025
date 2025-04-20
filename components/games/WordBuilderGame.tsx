import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Clock, Check, X, RefreshCw, Send } from 'lucide-react-native';

interface WordBuilderGameProps {
  onComplete: (score: number) => void;
}

// Dictionary of common words (simplified for this example)
const commonWords = [
  "act", "add", "age", "ago", "air", "all", "and", "any", "arm", "art", "ask", "ate",
  "bad", "bag", "bat", "bed", "bee", "big", "bit", "box", "boy", "bug", "bus", "but",
  "car", "cat", "cow", "cry", "cup", "cut", "dad", "day", "did", "dig", "dog", "dot",
  "dry", "ear", "eat", "egg", "end", "eye", "far", "fat", "few", "fit", "fix", "fly",
  "for", "fun", "gas", "get", "got", "gun", "had", "has", "hat", "her", "hid", "him",
  "his", "hit", "hot", "how", "ice", "ill", "its", "job", "joy", "key", "kid", "lay",
  "led", "leg", "let", "lie", "lip", "lot", "low", "mad", "man", "map", "may", "men",
  "met", "mix", "mom", "mud", "net", "new", "nod", "not", "now", "nut", "odd", "off",
  "oil", "old", "one", "our", "out", "own", "pay", "pen", "pet", "pie", "pig", "pin",
  "pit", "pot", "put", "ran", "rat", "raw", "red", "rid", "rip", "row", "run", "sad",
  "sat", "saw", "say", "sea", "see", "set", "she", "shy", "sin", "sit", "six", "sky",
  "sly", "so", "son", "spy", "sum", "sun", "tag", "tan", "tap", "tar", "tax", "tea",
  "ten", "the", "tie", "tin", "tip", "toe", "too", "top", "toy", "try", "two", "use",
  "van", "war", "was", "wax", "way", "web", "wet", "who", "why", "win", "won", "yes",
  "yet", "you", "zip", "zoo"
];

// Letter sets with many possible words
const letterSets = [
  ["s", "t", "a", "r", "e", "d", "p"],
  ["c", "l", "o", "u", "d", "s", "y"],
  ["b", "r", "e", "a", "k", "i", "n"],
  ["f", "l", "o", "w", "e", "r", "s"],
  ["p", "l", "a", "n", "e", "t", "s"],
  ["g", "r", "o", "u", "n", "d", "s"],
  ["s", "p", "a", "r", "k", "l", "e"],
  ["t", "h", "i", "n", "k", "e", "r"],
];

export const WordBuilderGame: React.FC<WordBuilderGameProps> = ({ onComplete }) => {
  const [letters, setLetters] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [possibleWords, setPossibleWords] = useState<string[]>([]);
  
  const inputRef = useRef<TextInput>(null);
  
  // Initialize game
  useEffect(() => {
    const randomSet = letterSets[Math.floor(Math.random() * letterSets.length)];
    setLetters(randomSet);
    
    // Find all possible words from the letter set
    const possible = findPossibleWords(randomSet);
    setPossibleWords(possible);
  }, []);
  
  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      endGame();
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);
  
  // Find all possible words from a set of letters
  const findPossibleWords = (letterSet: string[]) => {
    return commonWords.filter(word => {
      // Check if the word can be formed from the letters
      const letterCounts: Record<string, number> = {};
      
      // Count letters in the set
      letterSet.forEach(letter => {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      });
      
      // Check if each letter in the word is available in sufficient quantity
      for (const letter of word) {
        if (!letterCounts[letter]) return false;
        letterCounts[letter]--;
      }
      
      return true;
    });
  };
  
  // Start the game
  const startGame = () => {
    setIsActive(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    inputRef.current?.focus();
  };
  
  // End the game
  const endGame = () => {
    setIsActive(false);
    
    // Calculate final score
    const finalScore = calculateScore();
    
    // Show percentage of words found
    const percentFound = Math.round((foundWords.length / possibleWords.length) * 100);
    
    Alert.alert(
      "Time's Up!",
      `You found ${foundWords.length} out of ${possibleWords.length} possible words (${percentFound}%)`,
      [
        {
          text: "See Results",
          onPress: () => onComplete(finalScore)
        }
      ]
    );
  };
  
  // Calculate score based on words found and their length
  const calculateScore = () => {
    let wordScore = 0;
    
    foundWords.forEach(word => {
      // Points based on word length
      if (word.length <= 2) wordScore += 1;
      else if (word.length === 3) wordScore += 3;
      else if (word.length === 4) wordScore += 5;
      else if (word.length === 5) wordScore += 8;
      else wordScore += 10;
    });
    
    // Bonus for finding a high percentage of possible words
    const percentFound = foundWords.length / possibleWords.length;
    const percentBonus = Math.floor(percentFound * 50);
    
    return wordScore + percentBonus;
  };
  
  // Submit a word
  const submitWord = () => {
    const word = currentWord.toLowerCase().trim();
    
    // Check if word is valid
    if (word.length < 2) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    // Check if word has already been found
    if (foundWords.includes(word)) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setCurrentWord('');
      return;
    }
    
    // Check if word can be formed from the letters
    if (isValidWord(word)) {
      // Check if word is in the dictionary
      if (possibleWords.includes(word)) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Update found words list
        setFoundWords(prev => [...prev, word]);
        
        // Update score
        let wordScore = 0;
        if (word.length <= 2) wordScore = 1;
        else if (word.length === 3) wordScore = 3;
        else if (word.length === 4) wordScore = 5;
        else if (word.length === 5) wordScore = 8;
        else wordScore = 10;
        
        setScore(prev => prev + wordScore);
      } else {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } else {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
    
    setCurrentWord('');
  };
  
  // Check if a word can be formed from the available letters
  const isValidWord = (word: string) => {
    const letterCounts: Record<string, number> = {};
    
    // Count letters in the set
    letters.forEach(letter => {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    });
    
    // Check if each letter in the word is available in sufficient quantity
    for (const letter of word) {
      if (!letterCounts[letter]) return false;
      letterCounts[letter]--;
    }
    
    return true;
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Shuffle the letters
  const shuffleLetters = () => {
    setLetters(prev => [...prev].sort(() => 0.5 - Math.random()));
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Render word item for FlatList
  const renderWordItem = ({ item }: { item: string }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordText}>{item}</Text>
      <Text style={styles.wordPoints}>
        +{item.length <= 2 ? 1 : item.length === 3 ? 3 : item.length === 4 ? 5 : item.length === 5 ? 8 : 10}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {!isActive ? (
        <View style={styles.startContainer}>
          <Text style={styles.instructions}>
            Create as many words as possible using the letters below. Words must be at least 2 letters long.
          </Text>
          
          <View style={styles.lettersContainer}>
            {letters.map((letter, index) => (
              <View key={index} style={styles.letterTile}>
                <Text style={styles.letterText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.gameHeader}>
            <View style={styles.timerContainer}>
              <Clock size={16} color={colors.neutral} />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
          </View>
          
          <View style={styles.lettersContainer}>
            {letters.map((letter, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.letterTile}
                onPress={() => setCurrentWord(prev => prev + letter)}
              >
                <Text style={styles.letterText}>{letter.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.shuffleButton} onPress={shuffleLetters}>
              <RefreshCw size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={currentWord}
              onChangeText={setCurrentWord}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Type a word..."
              onSubmitEditing={submitWord}
            />
            
            <TouchableOpacity style={styles.submitButton} onPress={submitWord}>
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.wordsContainer}>
            <Text style={styles.wordsTitle}>Words Found ({foundWords.length}):</Text>
            
            {/* Removed ScrollView wrapper to fix VirtualizedList nesting error */}
            <FlatList
              data={foundWords}
              renderItem={renderWordItem}
              keyExtractor={(item) => item}
              numColumns={2}
              contentContainerStyle={styles.wordsList}
              style={styles.wordsListContainer}
            />
          </View>
        </>
      )}
      
      <Text style={styles.benefitsText}>
        Benefits: Improves vocabulary, cognitive flexibility, and word retrieval skills
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  startContainer: {
    alignItems: 'center',
  },
  instructions: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  letterTile: {
    width: 40,
    height: 40,
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  letterText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  scoreContainer: {
    backgroundColor: colors.primary + '20',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  shuffleButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
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
  wordsContainer: {
    marginBottom: 16,
    flex: 1,
  },
  wordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  wordsListContainer: {
    maxHeight: 150,
  },
  wordsList: {
    paddingBottom: 8,
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 8,
    flex: 1,
  },
  wordText: {
    fontSize: 14,
    color: colors.text,
  },
  wordPoints: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});