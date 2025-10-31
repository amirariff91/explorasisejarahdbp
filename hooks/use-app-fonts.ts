import { useFonts } from 'expo-font';
import { Galindo_400Regular } from '@expo-google-fonts/galindo';

// Font loader with Galindo from Google Fonts
export function useAppFonts() {
  const [loaded] = useFonts({
    'Galindo': Galindo_400Regular,
  });
  return loaded;
}

