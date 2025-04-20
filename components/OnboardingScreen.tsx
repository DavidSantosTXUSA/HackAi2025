import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Brain, Check, Heart, Smile, Star, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@/components/Picker';

const PERSONALITY_TYPES = [
  "Introverted", "Extroverted", "Creative", "Analytical", 
  "Adventurous", "Cautious", "Organized", "Spontaneous"
];

const HOBBY_OPTIONS = [
  "Reading", "Gaming", "Sports", "Music", "Art", "Cooking", 
  "Hiking", "Travel", "Photography", "Writing", "Dancing", "Yoga"
];

const MUSIC_TASTE_OPTIONS = [
  "Pop", "Rock", "Hip-Hop", "Classical", "Jazz", "Electronic", 
  "Country", "R&B", "Indie", "Metal", "Folk", "Alternative"
];

const EMOTIONAL_NEEDS_OPTIONS = [
  "Support", "Independence", "Validation", "Space", 
  "Encouragement", "Stability", "Challenge", "Comfort"
];

const COMMON_MOODS_OPTIONS = [
  "Happy", "Anxious", "Calm", "Energetic", "Thoughtful", 
  "Stressed", "Excited", "Melancholic", "Focused", "Relaxed"
];

const LEARNING_STYLE_OPTIONS = [
  "Visual", "Auditory", "Reading/Writing", "Kinesthetic", 
  "Logical", "Social", "Solitary", "Verbal"
];

const AGE_RANGES = [
  "7-12", "13-17", "18-22", "23-27", "28+"
];

const ONBOARDING_STEPS = [
  {
    title: "Welcome to Thinktopia",
    description: "Your journey to better mental strength and mood starts here. Let's get to know each other!",
    icon: <Brain size={48} color="#fff" />,
  },
  {
    title: "What should we call you?",
    description: "We'll use this name throughout the app.",
    icon: <Smile size={48} color="#fff" />,
    input: true,
    inputPlaceholder: "Your name",
  },
  {
    title: "How old are you?",
    description: "This helps us personalize your experience.",
    icon: <Star size={48} color="#fff" />,
    picker: true,
    pickerOptions: AGE_RANGES,
    pickerPlaceholder: "Select age range",
  },
  {
    title: "What's your personality like?",
    description: "Select traits that describe you best (choose up to 3).",
    icon: <Heart size={48} color="#fff" />,
    multiSelect: true,
    options: PERSONALITY_TYPES,
    maxSelections: 3,
  },
  {
    title: "What are your hobbies?",
    description: "Select activities you enjoy (choose up to 4).",
    icon: <Star size={48} color="#fff" />,
    multiSelect: true,
    options: HOBBY_OPTIONS,
    maxSelections: 4,
  },
  {
    title: "What music do you enjoy?",
    description: "Select your favorite music genres (choose up to 3).",
    icon: <Heart size={48} color="#fff" />,
    multiSelect: true,
    options: MUSIC_TASTE_OPTIONS,
    maxSelections: 3,
  },
  {
    title: "What are your emotional needs?",
    description: "Select what you need most for emotional well-being (choose up to 3).",
    icon: <Heart size={48} color="#fff" />,
    multiSelect: true,
    options: EMOTIONAL_NEEDS_OPTIONS,
    maxSelections: 3,
  },
  {
    title: "What moods do you experience often?",
    description: "Select moods you commonly feel (choose up to 4).",
    icon: <Smile size={48} color="#fff" />,
    multiSelect: true,
    options: COMMON_MOODS_OPTIONS,
    maxSelections: 4,
  },
  {
    title: "How do you learn best?",
    description: "Select your preferred learning styles (choose up to 2).",
    icon: <Brain size={48} color="#fff" />,
    multiSelect: true,
    options: LEARNING_STYLE_OPTIONS,
    maxSelections: 2,
  },
  {
    title: "Connect with Friends",
    description: "We'll help you find like-minded friends to support your mental health journey.",
    icon: <Users size={48} color="#fff" />,
    finalStep: true,
  },
];

export const OnboardingScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [personality, setPersonality] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [musicTaste, setMusicTaste] = useState<string[]>([]);
  const [emotionalNeeds, setEmotionalNeeds] = useState<string[]>([]);
  const [commonMoods, setCommonMoods] = useState<string[]>([]);
  const [learningStyle, setLearningStyle] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { updateProfile, setOnboarded, generateRecommendedFriends } = useUserStore();

  const handleNext = async () => {
    if (step === 1 && !name.trim()) {
      return; // Don't proceed if name is empty
    }
    
    if (step === 2 && !ageRange) {
      return; // Don't proceed if age range is not selected
    }
    
    if (step < ONBOARDING_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      setIsLoading(true);
      
      const userData = {
        name,
        ageRange,
        personality,
        hobbies,
        musicTaste,
        emotionalNeeds,
        commonMoods,
        learningStyle,
      };
      
      updateProfile(userData);
      
      // Generate recommended friends based on user data
      try {
        await generateRecommendedFriends(userData);
      } catch (error) {
        console.error("Error generating friends:", error);
      }
      
      setIsLoading(false);
      setOnboarded(true);
    }
  };

  const handleMultiSelect = (option: string, setter: React.Dispatch<React.SetStateAction<string[]>>, currentSelections: string[], maxSelections: number) => {
    if (currentSelections.includes(option)) {
      setter(currentSelections.filter(item => item !== option));
    } else if (currentSelections.length < maxSelections) {
      setter([...currentSelections, option]);
    }
  };

  const currentStep = ONBOARDING_STEPS[step];
  
  const isNextDisabled = () => {
    if (step === 1 && !name.trim()) return true;
    if (step === 2 && !ageRange) return true;
    if (currentStep.multiSelect && currentStep.options) {
      const selections = (() => {
        switch (step) {
          case 3: return personality;
          case 4: return hobbies;
          case 5: return musicTaste;
          case 6: return emotionalNeeds;
          case 7: return commonMoods;
          case 8: return learningStyle;
          default: return [];
        }
      })();
      return selections.length === 0;
    }
    return false;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Creating your personalized experience...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6C63FF', '#8F8AFF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          {currentStep.icon}
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.description}>{currentStep.description}</Text>
        
        {currentStep.input && (
          <TextInput
            style={styles.input}
            placeholder={currentStep.inputPlaceholder}
            value={name}
            onChangeText={setName}
            autoFocus
          />
        )}
        
        {currentStep.picker && (
          <Picker
            selectedValue={ageRange}
            onValueChange={(value) => setAgeRange(value)}
            items={currentStep.pickerOptions.map(option => ({ label: option, value: option }))}
            placeholder={currentStep.pickerPlaceholder}
          />
        )}
        
        {currentStep.multiSelect && currentStep.options && (
          <View style={styles.optionsContainer}>
            {currentStep.options.map((option) => {
              let isSelected = false;
              switch (step) {
                case 3: isSelected = personality.includes(option); break;
                case 4: isSelected = hobbies.includes(option); break;
                case 5: isSelected = musicTaste.includes(option); break;
                case 6: isSelected = emotionalNeeds.includes(option); break;
                case 7: isSelected = commonMoods.includes(option); break;
                case 8: isSelected = learningStyle.includes(option); break;
              }
              
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected
                  ]}
                  onPress={() => {
                    switch (step) {
                      case 3: handleMultiSelect(option, setPersonality, personality, currentStep.maxSelections); break;
                      case 4: handleMultiSelect(option, setHobbies, hobbies, currentStep.maxSelections); break;
                      case 5: handleMultiSelect(option, setMusicTaste, musicTaste, currentStep.maxSelections); break;
                      case 6: handleMultiSelect(option, setEmotionalNeeds, emotionalNeeds, currentStep.maxSelections); break;
                      case 7: handleMultiSelect(option, setCommonMoods, commonMoods, currentStep.maxSelections); break;
                      case 8: handleMultiSelect(option, setLearningStyle, learningStyle, currentStep.maxSelections); break;
                    }
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                  {isSelected && (
                    <Check size={16} color="#fff" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        
        {currentStep.finalStep && (
          <View style={styles.finalStepContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=500&auto=format&fit=crop' }}
              style={styles.finalStepImage}
              resizeMode="cover"
            />
            <Text style={styles.finalStepText}>
              Based on your preferences, we'll suggest friends who share similar interests and can support your mental health journey.
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_STEPS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === step && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            isNextDisabled() && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={isNextDisabled()}
        >
          <Text style={styles.nextButtonText}>
            {step < ONBOARDING_STEPS.length - 1 ? 'Next' : 'Get Started'}
          </Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  header: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.neutral,
    marginBottom: 24,
    lineHeight: 24,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
  },
  optionTextSelected: {
    color: '#fff',
  },
  checkIcon: {
    marginLeft: 4,
  },
  finalStepContainer: {
    alignItems: 'center',
  },
  finalStepImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  finalStepText: {
    fontSize: 16,
    color: colors.neutral,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pagination: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral + '40',
    marginRight: 8,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  nextButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  featuresContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.neutral,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
});