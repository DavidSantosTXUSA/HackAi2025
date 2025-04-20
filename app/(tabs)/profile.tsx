import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { useGameStore } from '@/store/game-store';
import { useMoodJournalStore } from '@/store/mood-journal-store';
import { Bell, HelpCircle, Info, LogOut, Mic, Moon, Music, Settings, User, Vibrate } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { VoiceRecordingsList } from '@/components/VoiceRecordingsList';
import { VoiceRecorder } from '@/components/VoiceRecorder';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, resetProgress } = useUserStore();
  const { resetGameProgress } = useGameStore();
  const { clearAllEntries, addVoiceRecording, currentMood } = useMoodJournalStore();
  const [showRecorder, setShowRecorder] = useState(false);
  
  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetProgress();
            resetGameProgress();
            clearAllEntries();
          }
        }
      ]
    );
  };
  
  const handleToggleNotifications = (value: boolean) => {
    updateProfile({
      preferences: {
        ...profile.preferences,
        notifications: value
      }
    });
  };
  
  const handleToggleDarkMode = (value: boolean) => {
    updateProfile({
      preferences: {
        ...profile.preferences,
        darkMode: value
      }
    });
  };
  
  const handleToggleSoundEffects = (value: boolean) => {
    updateProfile({
      preferences: {
        ...profile.preferences,
        soundEffects: value
      }
    });
  };
  
  const handleToggleMusic = (value: boolean) => {
    updateProfile({
      preferences: {
        ...profile.preferences,
        music: value
      }
    });
  };
  
  const handleToggleHapticFeedback = (value: boolean) => {
    updateProfile({
      preferences: {
        ...profile.preferences,
        hapticFeedback: value
      }
    });
  };
  
  const handleRecordingComplete = (uri: string, duration: number) => {
    // Add the voice recording
    addVoiceRecording({
      uri,
      duration,
      moodId: currentMood?.id || 'neutral',
      isPositiveAffirmation: true,
      title: "Positive Affirmation",
    });
    
    // Hide recorder
    setShowRecorder(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6C63FF', '#8F8AFF']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}</Text>
          </View>
          <Text style={styles.userName}>{profile.name || 'User'}</Text>
        </LinearGradient>
        
        <VoiceRecordingsList 
          title="Your Voice Recordings"
          onAddNew={() => setShowRecorder(true)}
        />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.text} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={profile.preferences.notifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.neutral + '40', true: colors.primary + '40' }}
              thumbColor={profile.preferences.notifications ? colors.primary : colors.neutral}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon size={20} color={colors.text} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={profile.preferences.darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: colors.neutral + '40', true: colors.primary + '40' }}
              thumbColor={profile.preferences.darkMode ? colors.primary : colors.neutral}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Settings size={20} color={colors.text} />
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch
              value={profile.preferences.soundEffects}
              onValueChange={handleToggleSoundEffects}
              trackColor={{ false: colors.neutral + '40', true: colors.primary + '40' }}
              thumbColor={profile.preferences.soundEffects ? colors.primary : colors.neutral}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Music size={20} color={colors.text} />
              <Text style={styles.settingText}>Music</Text>
            </View>
            <Switch
              value={profile.preferences.music}
              onValueChange={handleToggleMusic}
              trackColor={{ false: colors.neutral + '40', true: colors.primary + '40' }}
              thumbColor={profile.preferences.music ? colors.primary : colors.neutral}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Vibrate size={20} color={colors.text} />
              <Text style={styles.settingText}>Haptic Feedback</Text>
            </View>
            <Switch
              value={profile.preferences.hapticFeedback}
              onValueChange={handleToggleHapticFeedback}
              trackColor={{ false: colors.neutral + '40', true: colors.primary + '40' }}
              thumbColor={profile.preferences.hapticFeedback ? colors.primary : colors.neutral}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <User size={20} color={colors.text} />
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleResetProgress}>
            <View style={styles.menuInfo}>
              <LogOut size={20} color={colors.danger} />
              <Text style={[styles.menuText, { color: colors.danger }]}>Reset Progress</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <HelpCircle size={20} color={colors.text} />
              <Text style={styles.menuText}>Help & Support</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuInfo}>
              <Info size={20} color={colors.text} />
              <Text style={styles.menuText}>About MindMates</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
      
      {showRecorder && (
        <Modal
          visible={showRecorder}
          transparent
          animationType="slide"
          onRequestClose={() => setShowRecorder(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.recorderContainer}>
              <VoiceRecorder 
                onRecordingComplete={handleRecordingComplete}
                onCancel={() => setShowRecorder(false)}
                title="Record a Positive Affirmation"
              />
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  recorderContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
});