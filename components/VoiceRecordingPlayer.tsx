import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { colors } from '@/constants/colors';
import { Play, Pause, Trash2, Volume2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { VoiceRecording } from '@/types';

interface VoiceRecordingPlayerProps {
  recording: VoiceRecording;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
  compact?: boolean;
}

export const VoiceRecordingPlayer: React.FC<VoiceRecordingPlayerProps> = ({
  recording,
  onDelete,
  showDelete = true,
  compact = false,
}) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(recording.duration);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recording.uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading sound', error);
    }
  };

  useEffect(() => {
    loadSound();
  }, [recording.uri]);

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const handlePlayPause = async () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    if (!sound) {
      await loadSound();
      return;
    }
    
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playFromPositionAsync(position * 1000);
      setIsPlaying(true);
    }
  };

  const handleDelete = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (sound) {
      sound.unloadAsync();
    }
    
    if (onDelete) {
      onDelete(recording.id);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={styles.compactPlayButton}
          onPress={handlePlayPause}
        >
          {isPlaying ? (
            <Pause size={16} color="#fff" />
          ) : (
            <Play size={16} color="#fff" />
          )}
        </TouchableOpacity>
        
        <View style={styles.compactInfo}>
          <Text style={styles.compactTitle}>
            {recording.title || "Voice Recording"}
          </Text>
          <Text style={styles.compactDuration}>
            {formatTime(duration)}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Volume2 size={20} color={colors.primary} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {recording.title || "Voice Recording"}
          </Text>
          <Text style={styles.date}>{formatDate(recording.date)}</Text>
        </View>
        {showDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Trash2 size={16} color={colors.danger} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.playButton,
            isPlaying && styles.pauseButton
          ]}
          onPress={handlePlayPause}
        >
          {isPlaying ? (
            <Pause size={20} color="#fff" />
          ) : (
            <Play size={20} color="#fff" />
          )}
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(position / duration) * 100}%` }
              ]} 
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.neutral,
  },
  deleteButton: {
    padding: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pauseButton: {
    backgroundColor: colors.secondary,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: colors.neutral,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  compactPlayButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  compactInfo: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  compactDuration: {
    fontSize: 12,
    color: colors.neutral,
  },
});