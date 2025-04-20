export const colors = {
  primary: "#6C63FF", // Main purple
  secondary: "#FF9D7D", // Coral accent
  tertiary: "#63E2FF", // Light blue
  background: "#F8F9FF", // Light background
  darkBackground: "#2D3748", // Dark mode background
  text: "#2D3748", // Dark text
  lightText: "#F8F9FF", // Light text
  success: "#48BB78", // Green for positive feedback
  warning: "#F6AD55", // Orange for warnings
  danger: "#F56565", // Red for negative/danger
  neutral: "#A0AEC0", // Neutral gray
  card: "#FFFFFF", // Card background
  darkCard: "#3A4556", // Dark mode card
  highlight: "#FFE27D", // Yellow highlight
  shadow: "rgba(45, 55, 72, 0.1)", // Shadow color
  overlay: "rgba(45, 55, 72, 0.5)", // Overlay color
};

export const gradients = {
  primary: ["#6C63FF", "#8F8AFF"],
  secondary: ["#FF9D7D", "#FFBBA8"],
  success: ["#48BB78", "#68D391"],
  calm: ["#63E2FF", "#B6F0FF"],
  energy: ["#FFE27D", "#FFEFB9"],
  focus: ["#805AD5", "#B794F4"],
};

export default {
  light: {
    text: colors.text,
    background: colors.background,
    card: colors.card,
    tint: colors.primary,
    tabIconDefault: colors.neutral,
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.lightText,
    background: colors.darkBackground,
    card: colors.darkCard,
    tint: colors.primary,
    tabIconDefault: colors.neutral,
    tabIconSelected: colors.primary,
  },
};