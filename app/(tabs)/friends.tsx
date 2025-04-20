import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Modal, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/user-store';
import { colors } from '@/constants/colors';
import { Search, UserPlus, MessageSquare, Bell, X, Send, Mic, MicOff, Pause, Play } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function FriendsScreen() {
  const { friends, recommendedFriends, addFriend, sendCheckInPoke, sendMessage } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const chatListRef = useRef(null);

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecommendations = recommendedFriends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard listeners for adjusting the chat UI
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const keyboardDidShowListener = Platform.OS === 'ios' 
        ? Keyboard.addListener('keyboardWillShow', (e) => setKeyboardHeight(e.endCoordinates.height))
        : Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
        
      const keyboardDidHideListener = Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillHide', () => setKeyboardHeight(0))
        : Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }
  }, []);

  const handleAddFriend = (friend) => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    addFriend(friend);
  };

  const handleSendPoke = (friendId) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    sendCheckInPoke(friendId);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() && !audioUri) return;
    
    if (audioUri) {
      sendMessage(selectedFriend.id, audioUri, true);
      setAudioUri(null);
    } else {
      sendMessage(selectedFriend.id, messageText);
      setMessageText('');
    }
    
    // Scroll to the bottom after sending a message
    setTimeout(() => {
      if (chatListRef.current) {
        chatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
    
    // Simulate AI response
    simulateAIResponse(selectedFriend.id);
  };

  const startRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        alert('Voice recording is not supported on web');
        return;
      }
      
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      
      setRecordingInstance(recording);
      setIsRecording(true);
      
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    if (!recordingInstance) return;
    
    try {
      await recordingInstance.stopAndUnloadAsync();
      const uri = recordingInstance.getURI();
      setAudioUri(uri);
      setIsRecording(false);
      setRecordingInstance(null);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const playAudio = async (uri, messageId = null) => {
    try {
      if (Platform.OS === 'web') {
        alert('Audio playback is not supported on web');
        return;
      }
      
      // Stop any currently playing audio
      if (playbackInstance) {
        await playbackInstance.unloadAsync();
      }
      
      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlaybackInstance(sound);
      setPlayingMessageId(messageId);
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPlayingMessageId(null);
        }
      });
      
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play audio', error);
    }
  };

  const pauseAudio = async () => {
    if (!playbackInstance) return;
    
    try {
      await playbackInstance.pauseAsync();
      setIsPlaying(false);
      setPlayingMessageId(null);
    } catch (error) {
      console.error('Failed to pause audio', error);
    }
  };

  const simulateAIResponse = async (friendId) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const responses = [
        "Thanks for checking in! I'm doing well today.",
        "I'm feeling a bit stressed, but your message helps!",
        "Just finished a mindfulness exercise, feeling calm now.",
        "I appreciate you reaching out. How are you doing?",
        "I completed today's challenge! Have you done yours?",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      sendMessage(friendId, randomResponse, false, 'friend');
      setIsLoading(false);
      
      // Scroll to the bottom after receiving a response
      setTimeout(() => {
        if (chatListRef.current) {
          chatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ 
        title: "Friends",
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color={colors.text} />
          </TouchableOpacity>
        ),
      }} />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Friends</Text>
        {friends.length === 0 ? (
          <View style={styles.emptyState}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?q=80&w=300&auto=format&fit=crop' }}
              style={styles.emptyStateImage}
            />
            <Text style={styles.emptyStateText}>
              You haven't added any friends yet. Check out our recommendations below!
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.friendCard}
                onPress={() => setSelectedFriend(item)}
              >
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{item.name}</Text>
                  <Text style={styles.lastActive}>Active {item.lastActive}</Text>
                </View>
                <View style={styles.friendActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => setSelectedFriend(item)}
                  >
                    <MessageSquare size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleSendPoke(item.id)}
                  >
                    <Bell size={20} color={colors.secondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            style={styles.friendsList}
            contentContainerStyle={friends.length === 0 ? { flex: 1 } : {}}
          />
        )}
        
        <Text style={styles.sectionTitle}>Recommended Friends</Text>
        <FlatList
          data={filteredRecommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.recommendedCard}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{item.name}</Text>
                <Text style={styles.matchReason}>{item.matchReason}</Text>
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleAddFriend(item)}
              >
                <UserPlus size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          style={styles.recommendedList}
        />
      </View>
      
      {/* Friend Chat Modal */}
      <Modal
        visible={selectedFriend !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedFriend(null)}
      >
        {selectedFriend && (
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <LinearGradient
              colors={[colors.primary, '#8F8AFF']}
              style={styles.modalHeader}
            >
              <View style={styles.modalHeaderContent}>
                <Image source={{ uri: selectedFriend.avatar }} style={styles.modalAvatar} />
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalHeaderName}>{selectedFriend.name}</Text>
                  <Text style={styles.modalHeaderStatus}>Active {selectedFriend.lastActive}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => {
                    setSelectedFriend(null);
                    setMessageText('');
                    setAudioUri(null);
                    if (playbackInstance) {
                      playbackInstance.unloadAsync();
                      setPlaybackInstance(null);
                    }
                  }}
                >
                  <X size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            
            <View style={[styles.chatContainer, { paddingBottom: keyboardHeight > 0 ? 0 : 16 }]}>
              {selectedFriend.messages && selectedFriend.messages.length > 0 ? (
                <FlatList
                  ref={chatListRef}
                  data={selectedFriend.messages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={[
                      styles.messageContainer,
                      item.sender === 'user' ? styles.userMessage : styles.friendMessage
                    ]}>
                      {item.isAudio ? (
                        <TouchableOpacity 
                          style={styles.audioMessage}
                          onPress={() => {
                            if (playingMessageId === item.id && isPlaying) {
                              pauseAudio();
                            } else {
                              playAudio(item.content, item.id);
                            }
                          }}
                        >
                          {playingMessageId === item.id && isPlaying ? (
                            <Pause size={20} color={item.sender === 'user' ? '#fff' : colors.primary} />
                          ) : (
                            <Play size={20} color={item.sender === 'user' ? '#fff' : colors.primary} />
                          )}
                          <Text style={[
                            styles.audioText,
                            item.sender === 'user' ? styles.userAudioText : styles.friendAudioText
                          ]}>
                            Voice Message
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={[
                          styles.messageText,
                          item.sender === 'user' ? styles.userMessageText : styles.friendMessageText
                        ]}>
                          {item.content}
                        </Text>
                      )}
                      <Text style={[
                        styles.messageTime,
                        item.sender === 'user' ? styles.userMessageTime : styles.friendMessageTime
                      ]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  )}
                  contentContainerStyle={styles.messagesContent}
                  onContentSizeChange={() => chatListRef.current?.scrollToEnd({ animated: true })}
                  onLayout={() => chatListRef.current?.scrollToEnd({ animated: true })}
                />
              ) : (
                <View style={styles.emptyChatState}>
                  <Text style={styles.emptyChatText}>
                    Send a message to start chatting with {selectedFriend.name}
                  </Text>
                </View>
              )}
              
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.loadingText}>{selectedFriend.name} is typing...</Text>
                </View>
              )}
              
              <View style={styles.inputContainer}>
                {audioUri ? (
                  <View style={styles.audioPreview}>
                    <TouchableOpacity 
                      onPress={() => isPlaying ? pauseAudio() : playAudio(audioUri)}
                      style={styles.playButton}
                    >
                      {isPlaying ? (
                        <Pause size={20} color={colors.primary} />
                      ) : (
                        <Play size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.audioPreviewText}>Voice message ready</Text>
                    <TouchableOpacity 
                      onPress={() => setAudioUri(null)}
                      style={styles.cancelButton}
                    >
                      <X size={20} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TextInput
                    style={styles.messageInput}
                    placeholder="Type a message..."
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                  />
                )}
                
                {!audioUri && (
                  <TouchableOpacity 
                    style={styles.recordButton}
                    onPress={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? (
                      <MicOff size={24} color={colors.danger} />
                    ) : (
                      <Mic size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    (!messageText.trim() && !audioUri) && styles.disabledButton
                  ]}
                  onPress={handleSendMessage}
                  disabled={!messageText.trim() && !audioUri}
                >
                  <Send size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    marginRight: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginBottom: 24,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    lineHeight: 24,
  },
  friendsList: {
    marginBottom: 24,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  lastActive: {
    fontSize: 14,
    color: colors.neutral,
  },
  friendActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  recommendedList: {
    flex: 1,
  },
  recommendedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  matchReason: {
    fontSize: 14,
    color: colors.neutral,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  modalHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalHeaderInfo: {
    flex: 1,
  },
  modalHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalHeaderStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  friendMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#fff',
  },
  friendMessageText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  friendMessageTime: {
    color: colors.neutral,
  },
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  audioText: {
    fontSize: 16,
    marginLeft: 8,
  },
  userAudioText: {
    color: '#fff',
  },
  friendAudioText: {
    color: colors.text,
  },
  emptyChatState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyChatText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    backgroundColor: colors.card,
  },
  messageInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  audioPreview: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  audioPreviewText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  loadingText: {
    fontSize: 14,
    color: colors.neutral,
    marginLeft: 8,
  },
});