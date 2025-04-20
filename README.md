Here's a complete guide to set up and run the project in VSCode or any other development environment:

## Prerequisites

1. Node.js and npm: Install Node.js (version 16.x or higher recommended)
   
# Check if installed
node -v
npm -v

# If not installed, download from https://nodejs.org/

2. Expo CLI: Install Expo CLI globally
   
npm install -g expo-cli

## Project Setup

1. Clone or download the project to your local machine

2. Install dependencies: Navigate to the project directory and run:
   
npm install

3. Install specific dependencies: Make sure all these packages are installed:
   
npm install @expo/vector-icons@^14.0.2 @react-native-async-storage/async-storage@^2.1.2 @react-navigation/native@^7.0.0 expo@~52.0.36 expo-blur@~14.0.1 expo-constants@~17.0.7 expo-font@~13.0.4 expo-haptics@^14.0.1 expo-image@~2.0.6 expo-image-picker@~16.0.6 expo-linear-gradient@^14.0.2 expo-linking@~7.0.3 expo-location@~18.0.7 expo-router@~4.0.17 expo-splash-screen@~0.29.22 expo-status-bar@~2.0.0 expo-symbols@~0.2.0 expo-system-ui@~4.0.6 expo-web-browser@~14.0.1 lucide-react-native@^0.475.0 nativewind@^4.1.23 react@18.3.1 react-dom@18.3.1 react-native@0.76.7 react-native-gesture-handler@~2.20.2 react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0 react-native-svg@15.8.0 react-native-web@~0.19.13 zustand@^5.0.2

4. Install dev dependencies:
   
npm install --save-dev @babel/core@^7.25.2 @expo/ngrok@^4.1.0 @types/react@~18.3.12 typescript@~5.8.2

## Running the Project

1. Start the development server:
   
# For mobile development with tunnel (recommended)
npm start

# For web development
npm run start-web

# For web development with debug info
npm run start-web-dev
