import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useGameStore } from '@/store/game-store';
import { ChallengeCard } from '@/components/ChallengeCard';
import { MiniGameCard } from '@/components/MiniGameCard';
import { Challenge, MiniGame } from '@/types';
import { useRouter } from 'expo-router';

type ActivityTab = 'challenges' | 'games';

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('challenges');
  const router = useRouter();
  
  const { challenges, miniGames, dailyChallenges } = useGameStore();
  
  const unlockedChallenges = challenges.filter(c => c.unlocked);
  const unlockedGames = miniGames.filter(g => g.unlocked);
  
  const handleChallengePress = (challenge: Challenge) => {
    router.push(`/challenge/${challenge.id}`);
  };
  
  const handleGamePress = (game: MiniGame) => {
    router.push(`/mini-game/${game.id}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
            Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'games' && styles.activeTab]}
          onPress={() => setActiveTab('games')}
        >
          <Text style={[styles.tabText, activeTab === 'games' && styles.activeTabText]}>
            Mini-Games
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'challenges' && (
          <>
            {dailyChallenges.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Daily Challenges</Text>
                {dailyChallenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onPress={handleChallengePress}
                    isCompleted={challenge.completed}
                  />
                ))}
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>All Challenges</Text>
              {unlockedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onPress={handleChallengePress}
                  isCompleted={challenge.completed}
                />
              ))}
            </View>
          </>
        )}
        
        {activeTab === 'games' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mini-Games</Text>
            {unlockedGames.map((game) => (
              <MiniGameCard
                key={game.id}
                game={game}
                onPress={handleGamePress}
              />
            ))}
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral,
  },
  activeTabText: {
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
});