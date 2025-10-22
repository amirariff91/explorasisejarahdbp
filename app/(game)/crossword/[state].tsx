import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import type { MalaysianState } from '@/types';
import StatusBar from '@/components/game/StatusBar';
import MenuButton from '@/components/game/MenuButton';

/**
 * Crossword Screen - Figma Screen 12
 * Special crossword puzzle format
 */
export default function CrosswordScreen() {
  const { state } = useLocalSearchParams<{ state: MalaysianState }>();

  return (
    <ImageBackground
      source={require('@/assets/images/game/backgrounds/bg-main.png')}
      style={styles.container}
      resizeMode="cover">
      <StatusBar state={state || 'johor'} />
      <MenuButton />

      <View style={styles.content}>
        <Text style={styles.placeholder}>Crossword Puzzle - {state}</Text>
        <Text style={styles.placeholder}>Coming soon...</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 20,
    color: '#000',
    marginVertical: 10,
  },
});
