import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import type { MalaysianState } from '@/types';
import JohorCrossword from '@/components/game/crossword/JohorCrossword';
import StatusBar from '@/components/game/StatusBar';
import MenuButton from '@/components/game/MenuButton';

/**
 * Crossword Screen - Dynamic loader that delegates to state-specific crossword experiences.
 */
export default function CrosswordScreen() {
  const { state } = useLocalSearchParams<{ state: MalaysianState }>();

  if (state === 'johor') {
    return <JohorCrossword />;
  }

  return (
    <ImageBackground
      source={require('@/assets/images/game/backgrounds/bg-main.png')}
      style={styles.container}
      resizeMode="cover">
      <StatusBar state={state || 'johor'} />
      <MenuButton />

      <View style={styles.content}>
        <Text style={styles.placeholder}>Crossword Puzzle - {state}</Text>
        <Text style={styles.placeholder}>Kandungan dalam pembangunan.</Text>
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
