import { Mood } from "@/types";
import { colors } from "./colors";

export const moods: Mood[] = [
  {
    id: "joyful",
    name: "Joyful",
    emoji: "😄",
    color: "#FFD700",
    intensity: 5,
  },
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "#FFA500",
    intensity: 4,
  },
  {
    id: "calm",
    name: "Calm",
    emoji: "😌",
    color: "#63E2FF",
    intensity: 3,
  },
  {
    id: "neutral",
    name: "Neutral",
    emoji: "😐",
    color: "#A0AEC0",
    intensity: 3,
  },
  {
    id: "tired",
    name: "Tired",
    emoji: "😴",
    color: "#9370DB",
    intensity: 2,
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😔",
    color: "#6495ED",
    intensity: 2,
  },
  {
    id: "anxious",
    name: "Anxious",
    emoji: "😰",
    color: "#FFB6C1",
    intensity: 2,
  },
  {
    id: "angry",
    name: "Angry",
    emoji: "😠",
    color: "#FF6347",
    intensity: 1,
  },
  {
    id: "frustrated",
    name: "Frustrated",
    emoji: "😤",
    color: "#FF7F50",
    intensity: 1,
  },
  {
    id: "excited",
    name: "Excited",
    emoji: "🤩",
    color: "#FF1493",
    intensity: 5,
  },
  {
    id: "grateful",
    name: "Grateful",
    emoji: "🙏",
    color: "#9ACD32",
    intensity: 4,
  },
  {
    id: "proud",
    name: "Proud",
    emoji: "😎",
    color: "#4169E1",
    intensity: 4,
  },
];

export const getMoodById = (id: string): Mood | undefined => {
  return moods.find((mood) => mood.id === id);
};

export const getMoodsByIntensity = (intensity: number): Mood[] => {
  return moods.filter((mood) => mood.intensity === intensity);
};