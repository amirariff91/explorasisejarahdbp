import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GameProvider } from '@/contexts/GameContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { initializeAudio } from '@/utils/audio';

/**
 * Game Layout - Wraps all game screens with GameContext and ErrorBoundary
 * Route group: (game) - doesn't affect URL structure
 */
export default function GameLayout() {
  // Initialize audio system on app startup
  useEffect(() => {
    initializeAudio();
  }, []);

  return (
    <GameProvider>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </GameProvider>
  );
}
