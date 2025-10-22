import { useFonts } from 'expo-font';

// Graceful font loader: currently loads no custom fonts to avoid bundling errors
// when the font asset is not present. To enable Galindo, place the font file at
// assets/fonts/Galindo-Regular.ttf and add it to the map below.
export function useAppFonts() {
  const [loaded] = useFonts({
    // 'Galindo': require('@/assets/fonts/Galindo-Regular.ttf'),
  });
  return loaded;
}

