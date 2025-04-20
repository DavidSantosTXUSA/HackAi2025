import { Friend } from '@/types';

// This is a placeholder API key - replace with your actual key in production
const API_KEY = 'YOUR_API_KEY_HERE';

// Function to generate friend recommendations based on user data
export const generateFriendRecommendations = async (userData: any): Promise<Friend[]> => {
  try {
    // In a real implementation, this would call an AI service
    // For now, we'll simulate the API call
    
    const prompt = `
      Generate 5 friend recommendations for a user with the following profile:
      Name: ${userData.name}
      Age Range: ${userData.ageRange}
      Personality: ${userData.personality.join(', ')}
      Hobbies: ${userData.hobbies.join(', ')}
      Music Taste: ${userData.musicTaste.join(', ')}
      Emotional Needs: ${userData.emotionalNeeds.join(', ')}
      Common Moods: ${userData.commonMoods.join(', ')}
      Learning Style: ${userData.learningStyle.join(', ')}
      
      For each friend, provide:
      - A unique ID
      - A name
      - An age range (similar to the user's)
      - 2-3 personality traits
      - 2-3 hobbies
      - A specific reason why they would be a good match for the user
      - A "last active" status (e.g., "2 hours ago", "Just now")
      
      Format the response as a JSON array.
    `;
    
    // For now, we'll return mock data since there arent any actual live users to recommend, but in theory an LLM can be prompted to do this manually! 
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock recommendations based on user data
    return generateMockRecommendations(userData);
    
  } catch (error) {
    console.error('Error generating friend recommendations:', error);
    throw error;
  }
};

// Function to generate mock recommendations based on user data
const generateMockRecommendations = (userData: any): Friend[] => {
  const avatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop',
  ];
  
  const names = [
    'Alex', 'Jordan', 'Taylor', 'Riley', 'Casey', 'Morgan', 'Jamie',
    'Avery', 'Quinn', 'Skyler', 'Dakota', 'Reese', 'Parker', 'Hayden'
  ];
  
  const personalities = [
    'Introverted', 'Extroverted', 'Creative', 'Analytical', 
    'Adventurous', 'Cautious', 'Organized', 'Spontaneous',
    'Empathetic', 'Logical', 'Ambitious', 'Relaxed'
  ];
  
  const hobbies = [
    'Reading', 'Gaming', 'Sports', 'Music', 'Art', 'Cooking', 
    'Hiking', 'Travel', 'Photography', 'Writing', 'Dancing', 'Yoga',
    'Meditation', 'Gardening', 'Coding', 'Crafting'
  ];
  
  const lastActiveOptions = [
    'Just now', '5 minutes ago', '30 minutes ago', '1 hour ago',
    '2 hours ago', 'Today', 'Yesterday'
  ];
  
  // Generate 5 recommendations
  const recommendations: Friend[] = [];
  
  for (let i = 0; i < 5; i++) {
    // Select random avatar and name
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    
    // Generate personality traits (2-3)
    const personalityTraits: string[] = [];
    while (personalityTraits.length < 2 + Math.floor(Math.random() * 2)) {
      const trait = personalities[Math.floor(Math.random() * personalities.length)];
      if (!personalityTraits.includes(trait)) {
        personalityTraits.push(trait);
      }
    }
    
    // Generate hobbies (2-3)
    const userHobbies = userData.hobbies || [];
    const friendHobbies: string[] = [];
    
    // Try to include at least one matching hobby if possible
    if (userHobbies.length > 0) {
      const matchingHobby = userHobbies[Math.floor(Math.random() * userHobbies.length)];
      friendHobbies.push(matchingHobby);
    }
    
    // Add more random hobbies
    while (friendHobbies.length < 2 + Math.floor(Math.random() * 2)) {
      const hobby = hobbies[Math.floor(Math.random() * hobbies.length)];
      if (!friendHobbies.includes(hobby)) {
        friendHobbies.push(hobby);
      }
    }
    
    // Generate match reason
    let matchReason = '';
    
    // Check for matching hobbies
    const commonHobbies = friendHobbies.filter(hobby => userHobbies.includes(hobby));
    if (commonHobbies.length > 0) {
      matchReason = `You both enjoy ${commonHobbies[0]}`;
    } 
    // Check for matching personality traits
    else if (userData.personality && userData.personality.some(trait => personalityTraits.includes(trait))) {
      const commonTrait = userData.personality.find(trait => personalityTraits.includes(trait));
      matchReason = `You're both ${commonTrait}`;
    }
    // Default reason
    else {
      matchReason = `Similar ${userData.ageRange} age group`;
    }
    
    // Generate last active status
    const lastActive = lastActiveOptions[Math.floor(Math.random() * lastActiveOptions.length)];
    
    // Create friend recommendation
    recommendations.push({
      id: `rec${i + 1}`,
      name,
      avatar,
      ageRange: userData.ageRange,
      personality: personalityTraits,
      hobbies: friendHobbies,
      matchReason,
      lastActive,
      messages: [],
    });
  }
  
  return recommendations;
};

// Function to generate personalized journal prompts based on user data
// You can change this prompt here to change how the jounral is generated! Right now it takes in the users data, and current mood to generate a custom jounrnal prompt! Unique to every user!
export const generatePersonalizedPrompt = async (userData: any, currentMood?: any): Promise<string> => {
  try {
    const systemPrompt = `You are a thoughtful mental health assistant that creates personalized journal prompts. 
    Create a single, specific journal prompt that feels personal and relevant to the user based on their profile data.
    The prompt should be concise (1-2 sentences), thought-provoking, and encouraging.
    Do not include any explanations, just return the prompt itself.`;
    
    let userPrompt = `Based on this user profile, create a personalized journal prompt:
      Name: ${userData.name || 'User'}
      Age Range: ${userData.ageRange || 'Adult'}
      Personality: ${userData.personality?.join(', ') || 'Unknown'}
      Hobbies: ${userData.hobbies?.join(', ') || 'Various activities'}
      Music Taste: ${userData.musicTaste?.join(', ') || 'Various genres'}
      Emotional Needs: ${userData.emotionalNeeds?.join(', ') || 'Balance and growth'}
      Common Moods: ${userData.commonMoods?.join(', ') || 'Various moods'}
      Learning Style: ${userData.learningStyle?.join(', ') || 'Mixed'}
`;
    
    // Add current mood context if available
    if (currentMood) {
      userPrompt += `Current Mood: ${currentMood.name} (${currentMood.emoji})
`;
      
      // Add specific guidance based on mood
      if (currentMood.id === 'sad' || currentMood.id === 'anxious') {
        userPrompt += "The user is feeling down or anxious, so create a gentle, supportive prompt that acknowledges these feelings while encouraging reflection on small positives or sources of strength.";
      } else if (currentMood.id === 'happy' || currentMood.id === 'excited') {
        userPrompt += "The user is feeling positive, so create a prompt that helps them explore and build on these good feelings.";
      } else if (currentMood.id === 'neutral') {
        userPrompt += "The user is feeling neutral, so create a prompt that helps them explore their current state of mind with curiosity.";
      }
    }
    
    userPrompt += "Make the prompt personal by incorporating their specific interests, personality traits, or emotional needs.";
    
    // Call the LLM API
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.completion.trim();
    
  } catch (error) {
    console.error('Error generating personalized prompt:', error);
    // Fallback to static prompts if API fails
    return getRandomPrompt();
  }
};

// Function to call the LLM API for text generation
export const generateText = async (prompt: string): Promise<string> => {
  try {
    // This is a placeholder for a real API call
    
    const response = await fetch('https://toolkit.rork.com/text/llm/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.completion;
    
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
};

// Import from journal-prompts.ts to use as fallback so that way you can still run locally without a AI! 
import { getRandomPrompt } from '@/constants/journal-prompts';
