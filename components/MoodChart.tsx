import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { useMoodJournalStore } from '@/store/mood-journal-store';
import { Mood } from '@/types';

interface MoodChartProps {
  days?: number;
}

export const MoodChart: React.FC<MoodChartProps> = ({ days = 7 }) => {
  const getMoodTrend = useMoodJournalStore((state) => state.getMoodTrend);
  const moodData = getMoodTrend(days);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
  };

  const getEmptyDays = () => {
    const emptyDays = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      if (!moodData.find(item => item.date === dateString)) {
        emptyDays.push({
          date: dateString,
          formattedDate: formatDate(dateString),
        });
      }
    }
    
    return emptyDays;
  };

  const emptyDays = getEmptyDays();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Mood Trend</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          {moodData.map((item, index) => (
            <View key={item.date} style={styles.dayColumn}>
              <View 
                style={[
                  styles.moodIndicator, 
                  { backgroundColor: item.mood.color }
                ]}
              >
                <Text style={styles.moodEmoji}>{item.mood.emoji}</Text>
              </View>
              <Text style={styles.dayText}>{formatDate(item.date)}</Text>
            </View>
          ))}
          
          {emptyDays.map((day) => (
            <View key={day.date} style={styles.dayColumn}>
              <View style={styles.emptyMoodIndicator}>
                <Text style={styles.emptyMoodText}>?</Text>
              </View>
              <Text style={styles.dayText}>{day.formattedDate}</Text>
            </View>
          ))}
        </View>
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
  chartContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  dayColumn: {
    alignItems: 'center',
    minWidth: 60,
  },
  moodIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyMoodIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: colors.neutral + '30',
  },
  moodEmoji: {
    fontSize: 24,
  },
  emptyMoodText: {
    fontSize: 20,
    color: colors.neutral,
  },
  dayText: {
    fontSize: 12,
    color: colors.neutral,
    textAlign: 'center',
  },
});