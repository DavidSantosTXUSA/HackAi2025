export const journalPrompts = [
  "What made you smile today?",
  "What's something you're looking forward to?",
  "What's a challenge you overcame recently?",
  "What are three things you're grateful for today?",
  "What's something kind you did for someone else?",
  "What's something kind someone did for you?",
  "What's a goal you're working toward?",
  "What's something you learned today?",
  "What's a quality you like about yourself?",
  "What's a place that makes you feel peaceful?",
  "What's a memory that makes you happy?",
  "What's something that made you laugh recently?",
  "What's something you'd like to improve about yourself?",
  "What's a challenge you're facing right now?",
  "What's a way you can show yourself kindness today?",
  "What's something you're proud of accomplishing?",
  "Who is someone you admire and why?",
  "What's a hobby or activity that brings you joy?",
  "What's something you're curious about?",
  "What's a worry you can let go of today?",
  "What's something that helps you feel calm when you're stressed?",
  "What's a strength you used today?",
  "What's something beautiful you noticed today?",
  "What's something you're excited to learn more about?",
  "What's a way you can help someone else this week?",
  "What's a positive change you've noticed in yourself?",
  "What's a quote or saying that inspires you?",
  "What's something you can do to take care of your body today?",
  "What's something you can do to take care of your mind today?",
  "What's a small win you had today?",
];

export const getRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * journalPrompts.length);
  return journalPrompts[randomIndex];
};

export const getPromptsByTheme = (theme: string): string[] => {
  const themeMap: Record<string, string[]> = {
    gratitude: journalPrompts.filter(prompt => 
      prompt.toLowerCase().includes("grateful") || 
      prompt.toLowerCase().includes("thankful") ||
      prompt.toLowerCase().includes("appreciate")
    ),
    growth: journalPrompts.filter(prompt => 
      prompt.toLowerCase().includes("learn") || 
      prompt.toLowerCase().includes("improve") ||
      prompt.toLowerCase().includes("goal") ||
      prompt.toLowerCase().includes("challenge")
    ),
    joy: journalPrompts.filter(prompt => 
      prompt.toLowerCase().includes("happy") || 
      prompt.toLowerCase().includes("joy") ||
      prompt.toLowerCase().includes("smile") ||
      prompt.toLowerCase().includes("laugh")
    ),
    reflection: journalPrompts.filter(prompt => 
      prompt.toLowerCase().includes("think") || 
      prompt.toLowerCase().includes("reflect") ||
      prompt.toLowerCase().includes("notice") ||
      prompt.toLowerCase().includes("remember")
    ),
  };
  
  return themeMap[theme] || [];
};