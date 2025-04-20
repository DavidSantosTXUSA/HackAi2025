import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { moods } from '@/constants/moods';
import { Mood } from '@/types';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface MoodSelectorProps {
  onSelectMood: (mood: Mood) => void;
  selectedMood?: Mood | null;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ 
  onSelectMood, 
  selectedMood 
}) => {
  const handleMoodSelect = (mood: Mood) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onSelectMood(mood);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodList}
      >
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodItem,
              { backgroundColor: mood.color + '30' }, // Add transparency
              selectedMood?.id === mood.id && styles.selectedMood,
              selectedMood?.id === mood.id && { borderColor: mood.color }
            ]}
            onPress={() => handleMoodSelect(mood)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodName}>{mood.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
    paddingHorizontal: 16,
  },
  moodList: {
    paddingHorizontal: 8,
    gap: 12,
  },
  moodItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMood: {
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});