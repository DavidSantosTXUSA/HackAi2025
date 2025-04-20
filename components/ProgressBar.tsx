import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
  showPercentage?: boolean;
  height?: number;
  gradientColors?: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  height = 12,
  gradientColors = ['#6C63FF', '#8F8AFF'],
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const percentage = Math.round(clampedProgress * 100);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.progressContainer, { height }]}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.progressFill, { width: `${percentage}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      {showPercentage && <Text style={styles.percentage}>{percentage}%</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  progressContainer: {
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
    flex: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontSize: 12,
    color: colors.neutral,
    marginLeft: 8,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});