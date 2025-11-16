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

  // Lock screen orientation to landscape (both directions for better device support)
  useEffect(() => {
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        if (__DEV__) {
          console.log('Screen orientation locked to landscape');
        }
      } catch (error) {
        // Non-blocking: orientation lock is a UX enhancement, not critical
        if (__DEV__) {
          console.warn('Failed to lock screen orientation (this is normal on some simulators):', error);
        }
      }
    };

    // Execute async but don't await - don't block app startup
    lockOrientation();

    return () => {
      // Unlock orientation when component unmounts
      ScreenOrientation.unlockAsync().catch((error) => {
        if (__DEV__) {
          console.warn('Failed to unlock screen orientation:', error);
        }
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
