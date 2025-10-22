import { Stack } from 'expo-router';
import { GameProvider } from '@/contexts/GameContext';

/**
 * Game Layout - Wraps all game screens with GameContext
 * Route group: (game) - doesn't affect URL structure
 */
export default function GameLayout() {
  return (
    <GameProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false, // Prevent back gestures during quiz
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tutorial" />
        <Stack.Screen
          name="quiz/[state]"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="crossword/[state]"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </GameProvider>
  );
}
