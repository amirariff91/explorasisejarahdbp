import { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, useWindowDimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';
import { playSound } from '@/utils/audio';
import MenuButton from '@/components/game/MenuButton';
import MalaysiaMapSVG from '@/components/game/MalaysiaMapSVG';
import type { MalaysianState } from '@/types';

/**
 * State Selection Screen - Interactive SVG Map
 * Interactive Malaysia map similar to mypeta.ai
 * Users can tap on states to start the quiz
 */
export default function StateSelectionScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { gameState, isLoading, saveError } = useGameContext();
  const insets = useSafeAreaInsets();
  const isLandscape = width >= 800;
  const allowScaling = gameState.allowFontScaling;

  // Memoize callback to prevent recreating function on every render
  const handleStateSelect = useCallback((state: MalaysianState) => {
    router.push(`/quiz/${state}`);
  }, [router]);

  const handleTutorial = useCallback(() => {
    playSound('click');
    router.push('/tutorial');
  }, [router]);

  // Show loading screen while GameContext initializes
  if (isLoading) {
    return (
      <ImageBackground
        source={require('@/assets/images/game/backgrounds/bg-main.png')}
        style={styles.container}
        resizeMode="cover">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText} allowFontScaling={allowScaling}>
            Memuatkan kemajuan...
          </Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/game/backgrounds/bg-main.png')}
      style={styles.container}
      resizeMode="cover">

      {/* Top Bar */}
      <View style={[styles.topBar, { top: insets.top + 12 }]}>
        {/* Left Section - Menu + Tutorial */}
        <View style={styles.topBarLeft}>
          <MenuButton size="small" position="top-left" />
          <Pressable style={styles.tutorialButtonCompact} onPress={handleTutorial}>
            <Text style={styles.tutorialButtonText} allowFontScaling={allowScaling}>
              📖 Tutorial
            </Text>
          </Pressable>
        </View>

        {/* Middle Section - Title */}
        <View style={styles.topBarCenter}>
          <Text style={styles.mapTitle} allowFontScaling={allowScaling}>
            Peta Malaysia
          </Text>
        </View>

        {/* Right Section - Stats */}
        <View style={styles.topBarRight}>
          <View style={styles.statItemCompact}>
            <Text style={styles.statTextCompact} allowFontScaling={allowScaling}>
              💰 RM{gameState.money}
            </Text>
          </View>
          <View style={styles.statItemCompact}>
            <Text style={styles.statTextCompact} allowFontScaling={allowScaling}>
              ❤️ {gameState.health}%
            </Text>
          </View>
          <View style={styles.statItemCompact}>
            <Text style={styles.statTextCompact} allowFontScaling={allowScaling}>
              {gameState.completedStates.length}/14
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Banner */}
        {saveError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText} allowFontScaling={allowScaling}>{saveError}</Text>
          </View>
        )}

        {/* Interactive SVG Malaysia Map */}
        <MalaysiaMapSVG onStateSelect={handleStateSelect} />
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
    paddingTop: 52, // Reduced to minimize scrolling
    paddingBottom: 16,
    paddingHorizontal: 24,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: '#fff',
  },

  // Top Bar
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 100,
  },
  topBarLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  topBarCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  tutorialButtonCompact: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  tutorialButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
  },
  statItemCompact: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statTextCompact: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  mapTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
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
});
