import { MiniGame } from "@/types";

export const miniGames: MiniGame[] = [
  {
    id: "memory_match",
    name: "Memory Match",
    description: "Match pairs of cards to test your memory",
    type: "memory",
    difficulty: "easy",
    duration: 3,
    points: 15,
    highScore: 0,
    icon: "grid",
    unlocked: true,
  },
  {
    id: "focus_flow",
    name: "Focus Flow",
    description: "Follow the moving object and avoid distractions to improve concentration",
    type: "focus",
    difficulty: "medium",
    duration: 2,
    points: 15,
    highScore: 0,
    icon: "target",
    unlocked: true,
  },
  {
    id: "word_builder",
    name: "Word Builder",
    description: "Create as many words as possible from a set of letters",
    type: "creativity",
    difficulty: "medium",
    duration: 3,
    points: 20,
    highScore: 0,
    icon: "type",
    unlocked: true,
  },
  {
    id: "logic_puzzles_easy",
    name: "Logic Puzzles: Easy",
    description: "Solve simple logic puzzles to train your reasoning skills",
    type: "problem-solving",
    difficulty: "easy",
    duration: 2,
    points: 15,
    highScore: 0,
    icon: "puzzle",
    unlocked: true,
  },
  {
    id: "logic_puzzles_medium",
    name: "Logic Puzzles: Medium",
    description: "Challenge yourself with intermediate logic puzzles",
    type: "problem-solving",
    difficulty: "medium",
    duration: 4,
    points: 25,
    highScore: 0,
    icon: "puzzle",
    unlocked: true,
  },
  {
    id: "logic_puzzles_hard",
    name: "Logic Puzzles: Hard",
    description: "Test your limits with complex logic puzzles",
    type: "problem-solving",
    difficulty: "hard",
    duration: 6,
    points: 40,
    highScore: 0,
    icon: "puzzle",
    unlocked: false,
  },
  {
    id: "breathing_game",
    name: "Breath Pacer",
    description: "Follow the animated breathing guide to reduce stress and increase calm",
    type: "focus",
    difficulty: "easy",
    duration: 3,
    points: 15,
    highScore: 0,
    icon: "wind",
    unlocked: true,
  },
  {
    id: "gratitude_garden",
    name: "Gratitude Garden",
    description: "Grow a virtual garden by adding things you're grateful for",
    type: "emotional",
    difficulty: "easy",
    duration: 2,
    points: 10,
    highScore: 0,
    icon: "flower",
    unlocked: true,
  },
];

export const getUnlockedGames = (): MiniGame[] => {
  return miniGames.filter(game => game.unlocked);
};

export const getGamesByType = (type: MiniGame["type"]): MiniGame[] => {
  return miniGames.filter(game => game.type === type);
};

export const getGamesByDifficulty = (difficulty: MiniGame["difficulty"]): MiniGame[] => {
  return miniGames.filter(game => game.difficulty === difficulty);
};