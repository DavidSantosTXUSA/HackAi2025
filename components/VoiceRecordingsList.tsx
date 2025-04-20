import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { VoiceRecordingPlayer } from './VoiceRecordingPlayer';
import { VoiceRecording } from '@/types';
import { useMoodJournalStore } from '@/store/mood-journal-store';
import { Mic } from 'lucide-react-native';

interface VoiceRecordingsListProps {
  title?: string;
  limit?: number;
  showPositiveOnly?: boolean;
  onAddNew?: () => void;
}

export const VoiceRecordingsList: React.FC<VoiceRecordingsListProps> = ({
  title = "Your Voice Recordings",
  limit = 5,
  showPositiveOnly = false,
  onAddNew,
}) => {
  const { getRecentVoiceRecordings, getPositiveAffirmations, deleteVoiceRecording } = useMoodJournalStore();
  
  const recordings = showPositiveOnly 
    ? getPositiveAffirmations(limit)
    : getRecentVoiceRecordings(limit);
  
  const handleDelete = (id: string) => {
    deleteVoiceRecording(id);
  };
  
  if (recordings.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {onAddNew && (
            <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
              <Mic size={16} color={colors.primary} />
              <Text style={styles.addButtonText}>Record New</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {showPositiveOnly 
              ? "You haven't recorded any positive affirmations yet." 
              : "You haven't recorded any voice notes yet."}
          </Text>
          {onAddNew && (
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={onAddNew}
            >
              <Text style={styles.emptyButtonText}>
                {showPositiveOnly ? "Record an Affirmation" : "Record Your First Note"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onAddNew && (
          <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
            <Mic size={16} color={colors.primary} />
            <Text style={styles.addButtonText}>Record New</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.list}>
        {recordings.map((recording) => (
          <VoiceRecordingPlayer
            key={recording.id}
            recording={recording}
            onDelete={handleDelete}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  list: {
    maxHeight: 300,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});