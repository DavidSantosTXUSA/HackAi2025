import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { colors } from '@/constants/colors';
import { Mic, Square, Play, Pause, Save, X, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string, duration: number) => void;
  onCancel: () => void;
  title?: string;
  maxDuration?: number; // in seconds
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  title = "Record a positive affirmation",
  maxDuration = 60,
}) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request permissions
    Audio.requestPermissionsAsync();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    return () => {
      // Clean up
      if (recording) {
        stopRecording();
      }
      if (sound) {
        sound.unloadAsync();
      }
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      // Prepare the recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
      setTimer(interval);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      setIsRecording(false);
      if (timer) {
        clearInterval(timer);
        setTimer(null);
      }
      
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (uri) {
        setRecordingUri(uri);
        setDuration(recordingTime);
      }
      
      setRecording(null);
      
      // Set up audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecording = async () => {
    if (!recordingUri) return;
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      
      // If we already have a sound object, use it
      if (sound) {
        await sound.playFromPositionAsync(playbackPosition);
      } else {
        // Otherwise create a new one
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recordingUri },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        setSound(newSound);
      }
      
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const pausePlayback = async () => {
    if (!sound) return;
    
    try {
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to pause playback', err);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackPosition(0);
      }
    }
  };

  const handleSave = () => {
    if (recordingUri) {
      onRecordingComplete(recordingUri, duration);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const handleCancel = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
          <X size={20} color={colors.neutral} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>
          {isRecording || !recordingUri 
            ? formatTime(recordingTime) 
            : formatTime(duration)}
        </Text>
      </View>
      
      <View style={styles.controlsContainer}>
        {!recordingUri ? (
          // Recording controls
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordingButton
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <Square size={24} color="#fff" />
            ) : (
              <Mic size={24} color="#fff" />
            )}
          </TouchableOpacity>
        ) : (
          // Playback controls
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={isPlaying ? pausePlayback : playRecording}
            >
              {isPlaying ? (
                <Pause size={24} color="#fff" />
              ) : (
                <Play size={24} color="#fff" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                if (sound) {
                  sound.unloadAsync();
                  setSound(null);
                }
                setRecordingUri(null);
                setDuration(0);
                setPlaybackPosition(0);
              }}
            >
              <Trash2 size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {recordingUri && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Recording</Text>
          <Save size={20} color="#fff" />
        </TouchableOpacity>
      )}
      
      <Text style={styles.hint}>
        {!recordingUri 
          ? "Record a positive message for your future self" 
          : "Listen to your recording before saving"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timer: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  controlsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    backgroundColor: colors.danger,
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  saveButton: {
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  hint: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
  },
});