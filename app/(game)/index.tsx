import { View, Text, StyleSheet, ImageBackground, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import StateCard from '@/components/game/StateCard';
import type { MalaysianState } from '@/types';

// State display names (visuals like gradients + icons now in theme.ts)
const stateDisplayNames: Record<MalaysianState, string> = {
  'perlis': 'PERLIS',
  'kedah': 'KEDAH',
  'pulau-pinang': 'P. PINANG',
  'perak': 'PERAK',
  'selangor': 'SELANGOR',
  'kuala-lumpur': 'KL',
  'negeri-sembilan': 'N. SEMBILAN',
  'melaka': 'MELAKA',
  'johor': 'JOHOR',
  'pahang': 'PAHANG',
  'terengganu': 'TERENGGANU',
  'kelantan': 'KELANTAN',
  'sabah': 'SABAH',
  'sarawak': 'SARAWAK',
};

// Geographic layout - Peninsula states positioned roughly by geography
const peninsulaLayout: (MalaysianState | null)[][] = [
  // Row 1 - North
  ['perlis', 'kedah', 'kelantan', 'terengganu'],
  // Row 2 - North-Central
  ['pulau-pinang', 'perak', 'pahang', null],
  // Row 3 - Central
  ['selangor', 'kuala-lumpur', null, null],
  // Row 4 - Central-South
  ['negeri-sembilan', null, null, null],
  // Row 5 - South
  ['melaka', 'johor', null, null],
];

// Borneo states
const borneoStates: MalaysianState[] = ['sabah', 'sarawak'];

/**
 * State Selection Screen - Visual Grid Map
 * Geographic layout teaches Malaysian geography while allowing state selection
 */
export default function StateSelectionScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { gameState, hasSeenTutorial } = useGameContext();
  const isLandscape = width >= 800;
  const allowScaling = gameState.allowFontScaling;

  // Check if user needs to see tutorial
  if (!hasSeenTutorial) {
    return <Redirect href="/tutorial" />;
  }

  const handleStateSelect = (state: MalaysianState) => {
    router.push(`/quiz/${state}`);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/game/backgrounds/bg-main.png')}
      style={styles.container}
      resizeMode="cover">

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: isLandscape ? 28 : 24 }]} allowFontScaling={allowScaling}>
            EKSPLORASI{'\n'}SEJARAH DBP
          </Text>
          <Text style={[styles.subtitle, { fontSize: isLandscape ? 16 : 14 }]} allowFontScaling={allowScaling}>
            Pilih negeri untuk bermula
          </Text>
        </View>

        {/* Map Grid Container */}
        <View style={styles.mapContainer}>

          {/* Peninsula Region */}
          <View style={styles.peninsulaRegion}>
            <Text style={[styles.regionTitle, { fontSize: isLandscape ? 17 : 15 }]} allowFontScaling={allowScaling}>
              Semenanjung Malaysia
            </Text>
            {peninsulaLayout.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((stateId, colIndex) =>
                  stateId ? (
                    <StateCard
                      key={stateId}
                      stateId={stateId}
                      stateName={stateDisplayNames[stateId]}
                      isCompleted={gameState.completedStates.includes(stateId)}
                      onPress={handleStateSelect}
                    />
                  ) : (
                    <View key={`spacer-${rowIndex}-${colIndex}`} style={styles.cardSpacer} />
                  )
                )}
              </View>
            ))}
          </View>

          {/* Borneo Region */}
          <View style={styles.borneoRegion}>
            <Text style={[styles.regionTitle, { fontSize: isLandscape ? 17 : 15 }]} allowFontScaling={allowScaling}>
              Malaysia Timur
            </Text>
            <View style={styles.borneoCards}>
              {borneoStates.map(stateId => (
                <StateCard
                  key={stateId}
                  stateId={stateId}
                  stateName={stateDisplayNames[stateId]}
                  isCompleted={gameState.completedStates.includes(stateId)}
                  onPress={handleStateSelect}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Stats Footer */}
        <View style={styles.footer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statText, { fontSize: isLandscape ? 16 : 14 }]} allowFontScaling={allowScaling}>
                💰 RM{gameState.money}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statText, { fontSize: isLandscape ? 16 : 14 }]} allowFontScaling={allowScaling}>
                ❤️ {gameState.health}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statText, { fontSize: isLandscape ? 16 : 14 }]} allowFontScaling={allowScaling}>
                ✅ {gameState.completedStates.length}/14
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.tutorialButton}
            onPress={() => router.push('/tutorial')}
          >
            <Text style={[styles.tutorialButtonText, { fontSize: isLandscape ? 15 : 14 }]} allowFontScaling={allowScaling}>
              📖 Panduan
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: Typography.fontFamily,
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
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },

  // Map Container
  mapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 24,
    marginBottom: 12,
  },

  // Peninsula Region (Left)
  peninsulaRegion: {
    flex: 2,
  },
  regionTitle: {
    fontFamily: Typography.fontFamily,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  cardSpacer: {
    width: 100,
    height: 90,
  },

  // Borneo Region (Right)
  borneoRegion: {
    flex: 1,
    alignItems: 'center',
  },
  borneoCards: {
    gap: 8,
  },

  // Footer Stats
  footer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statText: {
    fontFamily: Typography.fontFamily,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  tutorialButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tutorialButtonText: {
    fontFamily: Typography.fontFamily,
    color: '#fff',
    fontWeight: 'bold',
  },
});
