import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { colors } from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Flower, Plus, Heart, Send, Check, Leaf } from 'lucide-react-native';
import { GratitudePlant } from '@/types';

interface GratitudeGardenGameProps {
  onComplete: (score: number) => void;
}

// Plant types with growth stages
const plantTypes = [
  {
    id: 'flower',
    name: 'Gratitude Flower',
    icon: Flower,
    stages: [
      'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1579546929518-9e84f7fa2081?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1579546929556-bf6485cc81f5?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1579546929586-7b649e5b91b0?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1579546928686-286c9fbde1ec?w=200&q=80&auto=format',
    ]
  },
  {
    id: 'succulent',
    name: 'Resilience Succulent',
    icon: Leaf,
    stages: [
      'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=200&q=80&auto=format',
    ]
  },
  {
    id: 'tree',
    name: 'Joy Tree',
    icon: Leaf,
    stages: [
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1530939027401-ab2a96f0fd5f?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=200&q=80&auto=format',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80&auto=format',
    ]
  }
];

// Gratitude prompts
const gratitudePrompts = [
  "What's something small that brought you joy today?",
  "Who is someone you're thankful to have in your life?",
  "What's something about your body or health you appreciate?",
  "What's a challenge you've overcome that you're grateful for?",
  "What's something in nature that fills you with wonder?",
  "What's a skill or ability you're thankful to have?",
  "What's a memory that makes you smile?",
  "What's something you're looking forward to?",
  "What's a lesson you've learned that you're grateful for?",
  "What's something you take for granted that you're actually lucky to have?",
];

export const GratitudeGardenGame: React.FC<GratitudeGardenGameProps> = ({ onComplete }) => {
  const [plants, setPlants] = useState<GratitudePlant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<GratitudePlant | null>(null);
  const [gratitudeEntry, setGratitudeEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [gameState, setGameState] = useState<'garden' | 'plant-selection' | 'entry' | 'complete'>('garden');
  const [selectedPlantType, setSelectedPlantType] = useState('');
  
  // Initialize with a random prompt
  useEffect(() => {
    getRandomPrompt();
  }, []);
  
  // Get a random gratitude prompt
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * gratitudePrompts.length);
    setCurrentPrompt(gratitudePrompts[randomIndex]);
  };
  
  // Start adding a new plant
  const handleAddPlant = () => {
    setGameState('plant-selection');
    setSelectedPlantType('');
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  // Select plant type
  const handleSelectPlantType = (typeId: string) => {
    setSelectedPlantType(typeId);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  
  // Confirm plant selection and move to entry
  const handleConfirmPlantSelection = () => {
    if (!selectedPlantType) return;
    
    const newPlant: GratitudePlant = {
      id: Date.now().toString(),
      type: selectedPlantType,
      stage: 1,
      entries: [],
      dateCreated: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
    };
    
    setPlants(prev => [...prev, newPlant]);
    setSelectedPlant(newPlant);
    setGameState('entry');
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  // Add gratitude entry to a plant
  const handleAddGratitudeEntry = () => {
    if (!gratitudeEntry.trim() || !selectedPlant) return;
    
    const updatedPlants = plants.map(plant => {
      if (plant.id === selectedPlant.id) {
        const updatedEntries = [...plant.entries, gratitudeEntry];
        const newStage = Math.min(Math.ceil(updatedEntries.length / 2), 5);
        
        return {
          ...plant,
          entries: updatedEntries,
          stage: newStage,
          lastWatered: new Date().toISOString(),
        };
      }
      return plant;
    });
    
    setPlants(updatedPlants);
    setGratitudeEntry('');
    getRandomPrompt();
    setGameState('garden');
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Check if any plant has reached stage 5
    if (updatedPlants.some(plant => plant.stage === 5)) {
      // Game complete when a plant reaches full growth
      setGameState('complete');
      
      // Calculate score based on number of plants and entries
      const totalEntries = updatedPlants.reduce((sum, plant) => sum + plant.entries.length, 0);
      const plantVarietyBonus = new Set(updatedPlants.map(p => p.type)).size * 10;
      const score = totalEntries * 5 + plantVarietyBonus;
      
      setTimeout(() => {
        onComplete(score);
      }, 1500);
    }
  };
  
  // Get plant image based on type and stage
  const getPlantImage = (type: string, stage: number) => {
    const plantType = plantTypes.find(p => p.id === type);
    if (!plantType) return '';
    
    return plantType.stages[stage - 1];
  };
  
  // Get plant name based on type
  const getPlantName = (type: string) => {
    const plantType = plantTypes.find(p => p.id === type);
    return plantType ? plantType.name : 'Plant';
  };

  // Render the garden view
  const renderGarden = () => (
    <>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gardenContainer}
      >
        {plants.map((plant) => (
          <TouchableOpacity
            key={plant.id}
            style={[
              styles.plantContainer,
              selectedPlant?.id === plant.id && styles.selectedPlantContainer
            ]}
            onPress={() => {
              setSelectedPlant(plant);
              setGameState('entry');
            }}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: getPlantImage(plant.type, plant.stage) }}
              style={styles.plantImage}
              resizeMode="cover"
            />
            <View style={styles.plantInfo}>
              <Text style={styles.plantName}>{getPlantName(plant.type)}</Text>
              <Text style={styles.plantEntries}>{plant.entries.length} entries</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={styles.addPlantContainer}
          onPress={handleAddPlant}
          activeOpacity={0.7}
        >
          <View style={styles.addPlantIcon}>
            <Plus size={24} color={colors.primary} />
          </View>
          <Text style={styles.addPlantText}>New Plant</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <Text style={styles.instructionText}>
        {plants.length === 0 
          ? "Start by adding a plant to your garden. Each plant represents an area of gratitude in your life."
          : "Tap on a plant to add gratitude entries. Watch your plants grow as you nurture them with positive thoughts!"}
      </Text>
    </>
  );

  // Render the plant selection view
  const renderPlantSelection = () => (
    <View style={styles.plantSelectionContainer}>
      <Text style={styles.plantSelectionTitle}>Choose a Plant</Text>
      
      <View style={styles.plantTypesList}>
        {plantTypes.map((type) => {
          const Icon = type.icon;
          return (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.plantTypeItem,
                selectedPlantType === type.id && styles.selectedPlantType
              ]}
              onPress={() => handleSelectPlantType(type.id)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: type.stages[0] }}
                style={styles.plantTypeImage}
                resizeMode="cover"
              />
              <View style={styles.plantTypeInfo}>
                <Icon size={16} color={colors.primary} />
                <Text style={styles.plantTypeName}>{type.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <View style={styles.plantSelectionButtons}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setGameState('garden')}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            !selectedPlantType && styles.disabledButton
          ]}
          onPress={handleConfirmPlantSelection}
          disabled={!selectedPlantType}
        >
          <Text style={styles.confirmButtonText}>Plant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render the gratitude entry view
  const renderGratitudeEntry = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.gratitudeContainer}
    >
      {selectedPlant && (
        <>
          <View style={styles.selectedPlantHeader}>
            <Image
              source={{ uri: getPlantImage(selectedPlant.type, selectedPlant.stage) }}
              style={styles.selectedPlantImage}
              resizeMode="cover"
            />
            <View style={styles.selectedPlantInfo}>
              <Text style={styles.selectedPlantName}>{getPlantName(selectedPlant.type)}</Text>
              <Text style={styles.selectedPlantEntries}>
                {selectedPlant.entries.length} {selectedPlant.entries.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>
          </View>

          <Text style={styles.promptText}>{currentPrompt}</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={gratitudeEntry}
              onChangeText={setGratitudeEntry}
              placeholder="Write something you're grateful for..."
              multiline
              maxLength={200}
            />
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                !gratitudeEntry.trim() && styles.disabledButton
              ]}
              onPress={handleAddGratitudeEntry}
              disabled={!gratitudeEntry.trim()}
            >
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {selectedPlant.entries.length > 0 && (
            <View style={styles.entriesContainer}>
              <Text style={styles.entriesTitle}>Previous Entries:</Text>
              <ScrollView style={styles.entriesList}>
                {selectedPlant.entries.map((entry, index) => (
                  <View key={index} style={styles.entryItem}>
                    <Heart size={16} color={colors.secondary} />
                    <Text style={styles.entryText}>{entry}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setGameState('garden')}
          >
            <Text style={styles.backButtonText}>Back to Garden</Text>
          </TouchableOpacity>
        </>
      )}
    </KeyboardAvoidingView>
  );

  // Render the completion view
  const renderCompletion = () => (
    <View style={styles.completionContainer}>
      <View style={styles.completionIcon}>
        <Check size={32} color="#fff" />
      </View>
      <Text style={styles.completionTitle}>Garden Flourishing!</Text>
      <Text style={styles.completionText}>
        You've grown a beautiful garden of gratitude. Keep nurturing it with positive thoughts!
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {plants.length === 0 && gameState === 'garden' ? (
        <View style={styles.emptyGarden}>
          <Text style={styles.emptyGardenText}>
            Your garden is empty. Plant something to get started!
          </Text>
          
          <TouchableOpacity 
            style={styles.addPlantButton}
            onPress={handleAddPlant}
          >
            <Plus size={20} color="#fff" />
            <Text style={styles.addPlantButtonText}>Plant Something</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {gameState === 'garden' && renderGarden()}
          {gameState === 'plant-selection' && renderPlantSelection()}
          {gameState === 'entry' && renderGratitudeEntry()}
          {gameState === 'complete' && renderCompletion()}
        </>
      )}
      
      <Text style={styles.benefitsText}>
        Benefits: Cultivates gratitude practice, improves mood, and builds resilience
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
    flex: 1,
  },
  emptyGarden: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyGardenText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  addPlantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  addPlantButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  gardenContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  plantContainer: {
    width: 120,
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlantContainer: {
    borderColor: colors.primary,
  },
  plantImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.background,
  },
  plantInfo: {
    padding: 8,
  },
  plantName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  plantEntries: {
    fontSize: 12,
    color: colors.neutral,
  },
  addPlantContainer: {
    width: 120,
    height: 150,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
    borderStyle: 'dashed',
  },
  addPlantIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addPlantText: {
    fontSize: 14,
    color: colors.primary,
  },
  instructionText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 16,
    fontStyle: 'italic',
  },
  plantSelectionContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
  },
  plantSelectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  plantTypesList: {
    marginBottom: 16,
  },
  plantTypeItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlantType: {
    borderColor: colors.primary,
  },
  plantTypeImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background,
  },
  plantTypeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  plantTypeName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },
  plantSelectionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.neutral,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  gratitudeContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    flex: 1,
  },
  selectedPlantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedPlantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedPlantInfo: {
    flex: 1,
  },
  selectedPlantName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  selectedPlantEntries: {
    fontSize: 14,
    color: colors.neutral,
  },
  promptText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  disabledButton: {
    opacity: 0.5,
  },
  entriesContainer: {
    marginTop: 8,
    flex: 1,
  },
  entriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  entriesList: {
    maxHeight: 120,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  entryText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  backButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
  },
  completionContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
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
  },
  benefitsText: {
    fontSize: 14,
    color: colors.neutral,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
    fontStyle: 'italic',
  },
});