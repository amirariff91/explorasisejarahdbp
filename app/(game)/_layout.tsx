import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
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

  // Lock screen orientation to landscape
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
        );
      } catch (error) {
        console.warn('Failed to lock screen orientation:', error);
      }
    };

    lockOrientation();

    return () => {
      // Unlock orientation when component unmounts
      ScreenOrientation.unlockAsync().catch((error) => {
        console.warn('Failed to unlock screen orientation:', error);
      });
    };
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
          <Stack.Screen
            name="log-masuk"
            options={{
              animation: 'fade',
            }}
          />
          <Stack.Screen
            name="map"
            options={{
              animation: 'fade',
            }}
          />
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
