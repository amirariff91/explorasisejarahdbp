import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppFonts } from '@/hooks/use-app-fonts';
import LoadingScreen from '@/components/game/LoadingScreen';
import { useEffect } from 'react';
import { preloadCriticalAssets } from '@/utils/preload-assets';

export const unstable_settings = {
  anchor: '(game)',
};

// Custom theme with transparent background to prevent white line at top
const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    // Best-effort preload critical assets without blocking the app
    preloadCriticalAssets().catch(() => {});
  }, []);

  if (!fontsLoaded) {
    return <LoadingScreen message="Memuatkan sumber..." />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : CustomTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="(game)" />
      </Stack>
      <StatusBar style="light" translucent backgroundColor="transparent" />
    </ThemeProvider>
  );
}
