import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { MessageCircle, Send, Copy, Check, RefreshCw } from 'lucide-react-native';

interface MessagePromptProps {
  prompts: string[];
  benefits: string;
  onComplete: () => void;
}

export const MessagePrompt: React.FC<MessagePromptProps> = ({
  prompts,
  benefits,
  onComplete,
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Get current prompt
  const currentPrompt = prompts[currentPromptIndex];
  
  // Change to next prompt
  const changePrompt = () => {
    const nextIndex = (currentPromptIndex + 1) % prompts.length;
    setCurrentPromptIndex(nextIndex);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Copy message to clipboard
  const copyMessage = () => {
    if (message.trim().length === 0) return;
    
    // In a real app, you would use Clipboard.setString(message)
    // For this example, we'll just simulate copying
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  // Mark as sent
  const markAsSent = () => {
    if (message.trim().length === 0) return;
    
    setIsComplete(true);
    onComplete();
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerIcon}>
          <MessageCircle size={20} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Reach Out</Text>
      </View>
      
      {!isComplete ? (
        <>
          <View style={styles.promptContainer}>
            <Text style={styles.promptLabel}>Suggestion:</Text>
            <Text style={styles.promptText}>{currentPrompt}</Text>
            <TouchableOpacity style={styles.changePromptButton} onPress={changePrompt}>
              <RefreshCw size={16} color={colors.primary} />
              <Text style={styles.changePromptText}>Try another suggestion</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.messageLabel}>Your message:</Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Write your message here..."
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.copyButton,
                message.trim().length === 0 && styles.disabledButton
              ]}
              onPress={copyMessage}
              disabled={message.trim().length === 0}
            >
              {isCopied ? (
                <Check size={20} color={colors.primary} />
              ) : (
                <Copy size={20} color={colors.primary} />
              )}
              <Text style={styles.copyButtonText}>
                {isCopied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.sendButton,
                message.trim().length === 0 && styles.disabledButton
              ]}
              onPress={markAsSent}
              disabled={message.trim().length === 0}
            >
              <Send size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Mark as Sent</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.tip}>
            Tip: Copy your message and paste it into your preferred messaging app to send it.
          </Text>
        </>
      ) : (
        <View style={styles.completionContainer}>
          <View style={styles.completionIcon}>
            <Check size={32} color="#fff" />
          </View>
          <Text style={styles.completionTitle}>Message Sent!</Text>
          <Text style={styles.completionText}>
            Great job reaching out! Maintaining social connections is important for mental health.
          </Text>
        </View>
      )}
      
      <Text style={styles.benefitsText}>Benefits: {benefits}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  promptContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  promptLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  changePromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  changePromptText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
  },
  copyButton: {
    backgroundColor: colors.background,
    marginRight: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  tip: {
    fontSize: 14,
    color: colors.neutral,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  completionContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  completionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    lineHeight: 22,
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});