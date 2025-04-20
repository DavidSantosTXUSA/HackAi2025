import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface MemoryMatchGameProps {
  onComplete: (score: number) => void;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<Array<{ id: number, value: number, flipped: boolean, matched: boolean }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  
  useEffect(() => {
    // Initialize cards
    const values = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    const shuffled = [...values].sort(() => 0.5 - Math.random());
    const newCards = shuffled.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false,
    }));
    setCards(newCards);
  }, []);
  
  useEffect(() => {
    // Check for matches when two cards are flipped
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      
      if (cards[first].value === cards[second].value) {
        // Match found
        setCards(prevCards => 
          prevCards.map((card, index) => 
            index === first || index === second
              ? { ...card, matched: true }
              : card
          )
        );
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map((card, index) => 
              index === first || index === second
                ? { ...card, flipped: false }
                : card
            )
          );
        }, 1000);
      }
      
      setFlippedCards([]);
      setMoves(prev => prev + 1);
    }
  }, [flippedCards]);
  
  useEffect(() => {
    // Check if all cards are matched
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameComplete(true);
      // Calculate score based on moves (fewer moves = higher score)
      const baseScore = 100;
      const penalty = Math.min(moves - 6, 15) * 5; // Minimum 6 moves needed, penalty for each extra move
      const score = Math.max(baseScore - penalty, 10); // Minimum score of 10
      
      onComplete(score);
    }
  }, [cards]);
  
  const handleCardPress = (index: number) => {
    // Ignore if card is already flipped or matched, or if two cards are already flipped
    if (
      cards[index].flipped || 
      cards[index].matched || 
      flippedCards.length === 2
    ) {
      return;
    }
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map((card, i) => 
        i === index ? { ...card, flipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prev => [...prev, index]);
    
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  const cardWidth = (Dimensions.get('window').width - 64) / 3;
  
  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Match pairs of cards with the same number. Try to complete the game in as few moves as possible!
      </Text>
      <Text style={styles.movesText}>Moves: {moves}</Text>
      
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { width: cardWidth, height: cardWidth },
              card.flipped && styles.cardFlipped,
              card.matched && styles.cardMatched,
            ]}
            onPress={() => handleCardPress(index)}
            disabled={gameComplete}
          >
            {(card.flipped || card.matched) && (
              <Text style={styles.cardText}>{card.value}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.benefitsText}>
        Benefits: Improves memory, concentration, and cognitive flexibility
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
    width: '100%',
  },
  instructions: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  movesText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  card: {
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  cardFlipped: {
    backgroundColor: colors.primary,
  },
  cardMatched: {
    backgroundColor: colors.success,
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});