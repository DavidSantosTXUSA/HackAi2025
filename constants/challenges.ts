import { Challenge } from "@/types";

export const challenges: Challenge[] = [
  {
    id: "breathing_1",
    title: "Deep Breathing",
    description: "Practice deep breathing for 2 minutes to calm your mind",
    type: "breathing",
    duration: 2,
    points: 10,
    completed: false,
    unlocked: true,
    icon: "wind",
    interactiveContent: {
      type: "breathing-exercise",
      pattern: "4-7-8",
      instructions: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 5 times.",
      benefits: "Reduces anxiety and helps you fall asleep faster"
    }
  },
  {
    id: "mindfulness_1",
    title: "Present Moment",
    description: "Focus on your surroundings and notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste",
    type: "mindfulness",
    duration: 5,
    points: 15,
    completed: false,
    unlocked: true,
    icon: "eye",
    interactiveContent: {
      type: "sensory-awareness",
      steps: [
        { sense: "see", count: 5, instruction: "Find 5 things you can see right now" },
        { sense: "touch", count: 4, instruction: "Notice 4 things you can feel" },
        { sense: "hear", count: 3, instruction: "Listen for 3 distinct sounds" },
        { sense: "smell", count: 2, instruction: "Identify 2 scents around you" },
        { sense: "taste", count: 1, instruction: "Notice 1 taste in your mouth" }
      ],
      benefits: "Grounds you in the present moment and reduces anxiety"
    }
  },
  {
    id: "gratitude_1",
    title: "Gratitude Journal",
    description: "Write down 3 things you're grateful for today",
    type: "gratitude",
    duration: 3,
    points: 10,
    completed: false,
    unlocked: true,
    icon: "heart",
    interactiveContent: {
      type: "journal-prompt",
      prompts: [
        "What's something small that brought you joy today?",
        "Who is someone you're thankful to have in your life?",
        "What's something about your body or health you appreciate?"
      ],
      benefits: "Increases positive emotions and improves outlook on life"
    }
  },
  {
    id: "physical_1",
    title: "Quick Stretch",
    description: "Do a quick full-body stretch to release tension",
    type: "physical",
    duration: 3,
    points: 10,
    completed: false,
    unlocked: true,
    icon: "activity",
    interactiveContent: {
      type: "guided-movement",
      steps: [
        { position: "Neck Rolls", duration: 30, instruction: "Gently roll your neck in circles, 5 times each direction" },
        { position: "Shoulder Stretch", duration: 30, instruction: "Roll shoulders back and forth, then stretch arms overhead" },
        { position: "Side Stretch", duration: 30, instruction: "Reach arm overhead and lean to each side" },
        { position: "Forward Fold", duration: 30, instruction: "Bend forward from hips, letting arms hang down" },
        { position: "Gentle Twist", duration: 30, instruction: "Sitting or standing, gently twist torso to each side" }
      ],
      benefits: "Releases physical tension which helps reduce mental stress"
    }
  },
  {
    id: "cognitive_1",
    title: "Word Association",
    description: "Play a quick word association game to stimulate your brain",
    type: "cognitive",
    duration: 2,
    points: 10,
    completed: false,
    unlocked: true,
    icon: "brain",
    interactiveContent: {
      type: "word-game",
      startWords: ["blue", "happy", "tree", "music", "dream", "water", "light"],
      instructions: "For each word, quickly think of a related word. Try to create a chain of 10 associated words.",
      benefits: "Activates creative thinking and improves cognitive flexibility"
    }
  },
  {
    id: "social_1",
    title: "Reach Out",
    description: "Send a positive message to a friend or family member",
    type: "social",
    duration: 2,
    points: 15,
    completed: false,
    unlocked: true,
    icon: "message-circle",
    interactiveContent: {
      type: "message-prompt",
      prompts: [
        "Share a memory that made you smile",
        "Tell someone why you appreciate them",
        "Ask how someone is doing and really listen",
        "Share something interesting you learned recently",
        "Send an encouraging note to someone who might need it"
      ],
      benefits: "Strengthens social connections which are vital for mental health"
    }
  },
  {
    id: "breathing_2",
    title: "Box Breathing",
    description: "Practice box breathing: inhale for 4 counts, hold for 4, exhale for 4, hold for 4",
    type: "breathing",
    duration: 4,
    points: 15,
    completed: false,
    unlocked: false,
    icon: "square",
    interactiveContent: {
      type: "breathing-exercise",
      pattern: "box",
      instructions: "Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 6 times.",
      benefits: "Used by Navy SEALs to remain calm under pressure and improve focus"
    }
  },
  {
    id: "mindfulness_2",
    title: "Body Scan",
    description: "Perform a body scan meditation, focusing on each part of your body",
    type: "mindfulness",
    duration: 7,
    points: 20,
    completed: false,
    unlocked: false,
    icon: "scan",
    interactiveContent: {
      type: "guided-meditation",
      steps: [
        { bodyPart: "Feet", duration: 30, instruction: "Notice any sensations in your feet without judgment" },
        { bodyPart: "Legs", duration: 30, instruction: "Bring awareness to your legs, noticing any tension" },
        { bodyPart: "Torso", duration: 30, instruction: "Feel your breath in your chest and abdomen" },
        { bodyPart: "Arms", duration: 30, instruction: "Notice sensations in your arms and hands" },
        { bodyPart: "Shoulders", duration: 30, instruction: "Release any tension in your shoulders" },
        { bodyPart: "Neck", duration: 30, instruction: "Gently notice your neck and throat" },
        { bodyPart: "Face", duration: 30, instruction: "Relax all the muscles in your face" },
        { bodyPart: "Whole Body", duration: 60, instruction: "Feel your entire body as one" }
      ],
      benefits: "Reduces stress by bringing awareness to physical sensations without judgment"
    }
  },
  {
    id: "gratitude_2",
    title: "Thank You Note",
    description: "Write a thank you note to someone who has helped you recently",
    type: "gratitude",
    duration: 5,
    points: 20,
    completed: false,
    unlocked: false,
    icon: "pen",
    interactiveContent: {
      type: "writing-exercise",
      prompts: [
        "Who has helped you recently that you haven't properly thanked?",
        "What specifically did they do that you appreciate?",
        "How did their action affect you?",
        "What qualities do you value in this person?"
      ],
      template: "Dear [Name],\n\nI wanted to take a moment to thank you for [what they did]. When you [specific action], it made me feel [how it affected you]. I really appreciate your [quality] and wanted you to know the difference you've made.\n\nThank you,\n[Your Name]",
      benefits: "Expressing gratitude increases happiness for both the giver and receiver"
    }
  },
  {
    id: "physical_2",
    title: "Power Pose",
    description: "Stand in a power pose for 2 minutes to boost confidence",
    type: "physical",
    duration: 2,
    points: 10,
    completed: false,
    unlocked: false,
    icon: "user",
    interactiveContent: {
      type: "guided-movement",
      steps: [
        { position: "Wonder Woman", duration: 60, instruction: "Stand with feet hip-width apart, hands on hips, chest open" },
        { position: "Victory", duration: 60, instruction: "Stand tall with arms raised in a V shape above your head" }
      ],
      benefits: "Research suggests power poses can increase confidence and reduce stress hormones"
    }
  },
];

export const getDailyChallenges = (count: number = 3): Challenge[] => {
  const unlockedChallenges = challenges.filter(challenge => challenge.unlocked);
  const shuffled = [...unlockedChallenges].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getChallengesByType = (type: Challenge["type"]): Challenge[] => {
  return challenges.filter(challenge => challenge.type === type);
};