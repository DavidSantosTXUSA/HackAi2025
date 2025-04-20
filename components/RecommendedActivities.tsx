import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { Challenge, MiniGame } from '@/types';
import { useGameStore } from '@/store/game-store';
import { ChallengeCard } from './ChallengeCard';
import { MiniGameCard } from './MiniGameCard';
import { useRouter } from 'expo-router';

export const RecommendedActivities: React.FC = () => {
  const router = useRouter();
  const { challenges, miniGames } = useGameStore();
  
  // Get a mix of challenges and games
  const unlockedChallenges = challenges.filter(c => c.unlocked && !c.completed).slice(0, 2);
  const unlockedGames = miniGames.filter(g => g.unlocked).slice(0, 2);
  
  const handleChallengePress = (challenge: Challenge) => {
    router.push(`/challenge/${challenge.id}`);
  };
  
  const handleGamePress = (game: MiniGame) => {
    router.push(`/mini-game/${game.id}`);
  };
  
  const handleSeeAllPress = () => {
    router.push('/activities');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended For You</Text>
        <TouchableOpacity onPress={handleSeeAllPress}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {unlockedChallenges.map((challenge) => (
          <View key={challenge.id} style={styles.cardContainer}>
            <ChallengeCard 
              challenge={challenge} 
              onPress={handleChallengePress} 
            />
          </View>
        ))}
        
        {unlockedGames.map((game) => (
          <View key={game.id} style={styles.cardContainer}>
            <MiniGameCard 
              game={game} 
              onPress={handleGamePress} 
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardContainer: {
    width: 280,
    marginRight: 16,
  },
});