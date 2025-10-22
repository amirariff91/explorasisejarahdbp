import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppFonts } from '@/hooks/use-app-fonts';
import LoadingScreen from '@/components/game/LoadingScreen';

export const unstable_settings = {
  anchor: '(game)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return <LoadingScreen message="Memuatkan sumber..." />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="(game)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
