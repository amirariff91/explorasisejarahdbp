import { View, Text, StyleSheet, ImageBackground, Pressable, useWindowDimensions } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Image } from 'expo-image';
import { Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import type { MalaysianState } from '@/types';

/**
 * State Selection Screen - Landscape Optimized
 * Columnar layout: Peninsula states (left) | Center info | Borneo states (right)
 */
export default function StateSelectionScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { gameState, hasSeenTutorial } = useGameContext();
  const isLandscape = width >= 800; // Landscape mode threshold (Figma: 895px)
  const allowScaling = gameState.allowFontScaling;

  // Check if user needs to see tutorial
  if (!hasSeenTutorial) {
    return <Redirect href="/tutorial" />;
  }

  const handleStateSelect = (state: MalaysianState) => {
    router.push(`/quiz/${state}`);
  };

  // Peninsula Malaysia (West Coast + East Coast)
  const peninsulaStates: Array<{ id: MalaysianState; name: string }> = [
    { id: 'perlis', name: 'PERLIS' },
    { id: 'kedah', name: 'KEDAH' },
    { id: 'pulau-pinang', name: 'PULAU PINANG' },
    { id: 'perak', name: 'PERAK' },
    { id: 'selangor', name: 'SELANGOR' },
    { id: 'negeri-sembilan', name: 'NEGERI SEMBILAN' },
    { id: 'melaka', name: 'MELAKA' },
    { id: 'johor', name: 'JOHOR' },
    { id: 'pahang', name: 'PAHANG' },
    { id: 'terengganu', name: 'TERENGGANU' },
    { id: 'kelantan', name: 'KELANTAN' },
  ];

  // East Malaysia (Borneo)
  const borneoStates: Array<{ id: MalaysianState; name: string }> = [
    { id: 'sabah', name: 'SABAH' },
    { id: 'sarawak', name: 'SARAWAK' },
  ];

  const edgeMargin = isLandscape ? 40 : 30;

  const renderStateButton = (state: { id: MalaysianState; name: string }) => {
    const isCompleted = gameState.completedStates.includes(state.id);
    return (
      <Pressable
        key={state.id}
        style={[
          styles.stateButton,
          { marginVertical: isLandscape ? 6 : 5 },
          isCompleted && styles.stateButtonCompleted,
        ]}
        onPress={() => handleStateSelect(state.id)}>
        <Text style={[styles.stateButtonText, { fontSize: isLandscape ? 15 : 13 }]} allowFontScaling={allowScaling}>
          {isCompleted ? '✓ ' : ''}
          {state.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <ImageBackground
      source={require('@/assets/images/game/backgrounds/bg-main.png')}
      style={styles.container}
      resizeMode="cover">

      {/* Three-Column Layout: Peninsula | Center Info | Borneo */}
      <View style={[styles.columnsContainer, { paddingHorizontal: edgeMargin }]}>

        {/* Left Column: Peninsula States */}
        <View style={styles.statesColumn}>
          <Text style={[styles.columnTitle, { fontSize: isLandscape ? 17 : 15 }]} allowFontScaling={allowScaling}>
            Semenanjung Malaysia
          </Text>
          {peninsulaStates.map(renderStateButton)}
        </View>

        {/* Center Column: Title + Stats + Tutorial */}
        <View style={styles.centerColumn}>
          <View style={styles.centerContent}>
            <Text style={[styles.title, { fontSize: isLandscape ? 28 : 24 }]} allowFontScaling={allowScaling}>
              EKSPLORASI{'\n'}SEJARAH DBP
            </Text>

            <Text style={[styles.subtitle, { fontSize: isLandscape ? 16 : 14 }]} allowFontScaling={allowScaling}>
              Pilih negeri untuk bermula
            </Text>

            {/* Game Stats Display */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statsText, { fontSize: isLandscape ? 16 : 15 }]} allowFontScaling={allowScaling}>
                  💰 RM{gameState.money}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statsText, { fontSize: isLandscape ? 16 : 15 }]} allowFontScaling={allowScaling}>
                  ❤️ {gameState.health}%
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statsText, { fontSize: isLandscape ? 16 : 15 }]} allowFontScaling={allowScaling}>
                  ✅ {gameState.completedStates.length}/13
                </Text>
              </View>
            </View>

            {/* Tutorial Button */}
            <Pressable
              style={[styles.tutorialButton, { paddingVertical: isLandscape ? 14 : 12 }]}
              onPress={() => router.push('/tutorial')}>
              <Text style={[styles.tutorialButtonText, { fontSize: isLandscape ? 16 : 15 }]} allowFontScaling={allowScaling}>
                📖 Panduan
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Right Column: Borneo States */}
        <View style={styles.statesColumn}>
          <Text style={[styles.columnTitle, { fontSize: isLandscape ? 17 : 15 }]} allowFontScaling={allowScaling}>
            Malaysia Timur
          </Text>
          {borneoStates.map(renderStateButton)}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Three-Column Layout
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 50,
    paddingBottom: 20,
    gap: 20,
  },

  // Left & Right Columns: States
  statesColumn: {
    flex: 1,
    paddingTop: 10,
  },
  columnTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  stateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignSelf: 'center',
    width: '90%',
    minHeight: 44,
  },
  stateButtonCompleted: {
    backgroundColor: '#FFC107',
  },
  stateButtonText: {
    fontFamily: Typography.fontFamily,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  // Center Column: Title + Stats
  centerColumn: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    gap: 18,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    lineHeight: 32,
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginTop: 10,
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
  },
  statsText: {
    fontFamily: Typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  tutorialButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tutorialButtonText: {
    fontFamily: Typography.fontFamily,
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
