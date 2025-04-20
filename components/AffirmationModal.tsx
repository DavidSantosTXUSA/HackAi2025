import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { VoiceRecordingPlayer } from './VoiceRecordingPlayer';
import { VoiceRecording } from '@/types';
import { X, Heart } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface AffirmationModalProps {
  visible: boolean;
  onClose: () => void;
  recording: VoiceRecording;
}

export const AffirmationModal: React.FC<AffirmationModalProps> = ({
  visible,
  onClose,
  recording,
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  
  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });
  
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ scale }], opacity }
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Heart size={24} color="#fff" />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.neutral} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.title}>Listen to Your Positive Affirmation</Text>
          <Text style={styles.subtitle}>
            Remember the strength and positivity you felt when you recorded this message.
          </Text>
          
          <View style={styles.playerContainer}>
            <VoiceRecordingPlayer 
              recording={recording} 
              showDelete={false}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.closeTextButton}
            onPress={onClose}
          >
            <Text style={styles.closeTextButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral,
    marginBottom: 24,
    lineHeight: 22,
  },
  playerContainer: {
    marginBottom: 24,
  },
  closeTextButton: {
    alignItems: 'center',
    padding: 12,
  },
  closeTextButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
});