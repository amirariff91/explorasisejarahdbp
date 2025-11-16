import MalaysiaMapSVG from "@/components/game/MalaysiaMapSVG";
import { BorderRadius, Colors, Shadows, Typography, getComponentShadowStyle, getResponsiveFontSize } from "@/constants/theme";
import { useGameContext } from "@/contexts/GameContext";
import { getMapBoardSize } from "@/constants/layout";
import type { MalaysianState } from "@/types";
import { playAmbient, playMusic, playSound, stopAllAmbient, stopMusic } from "@/utils/audio";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    type LayoutChangeEvent,
} from "react-native";
import { Alert } from "react-native";
import { ASSETS, ASSET_PRELOAD_CONFIG } from "@/constants/assets";
import { preloadAssets } from "@/utils/preload-assets";
import { getQuestionsForState } from "@/data/questions";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Local layout configuration
const LAYOUT_CONFIG = {
  minTopBarHeight: 60, // Initial value before measurement
  topBarSpacing: 12, // Spacing from safe area top
  mapPadding: 10,
  elementSpacing: 12,
  dropdownMinOffset: 10,
  buttonSafeMargin: 20,
};

/**
 * State Selection Screen - Interactive SVG Map
 * Interactive Malaysia map similar to mypeta.ai
 * Users can tap on states to start the quiz
 */
export default function StateSelectionScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const {
    gameState,
    isLoading,
    saveError,
    setCurrentState,
    clearStateAnswers,
    setQuestionIndexForState,
    clearStateTimer,
  } = useGameContext();
  const insets = useSafeAreaInsets();
  const allowScaling = gameState.allowFontScaling;

  // Route guard: Check if player profile exists
  useEffect(() => {
    if (!isLoading && !gameState.playerProfile) {
      router.replace('/log-masuk');
    }
  }, [gameState.playerProfile, isLoading, router]);

  const [isPreloading, setIsPreloading] = useState(false);

  // Play background music and ambient sounds on mount
  useEffect(() => {
    playMusic('bgm-map', true, 2000); // Fade in map theme
    playAmbient('ambient-map', 0.2); // Subtle tropical ambience

    return () => {
      // No stopMusic needed - next screen's playMusic() will handle transition
      stopAllAmbient();
    };
  }, []);

  // Preload lazy game assets while on map for smoother transitions
  useEffect(() => {
    setIsPreloading(true);
    preloadAssets(ASSET_PRELOAD_CONFIG.lazy)
      .catch(() => {})
      .finally(() => setIsPreloading(false));
  }, []);

  // Measure actual rendered heights for accurate spacing
  const [topBarHeight, setTopBarHeight] = useState(
    LAYOUT_CONFIG.minTopBarHeight,
  );

  // Memoize callback to prevent recreating function on every render
  const handleStateSelect = useCallback(
    (state: MalaysianState) => {
      playSound('click'); // Soft, pleasant feedback for state selection
      setCurrentState(state);
      clearStateTimer(); // Prevent stale timers from previous states

      const proceed = () => {
        if (state === 'johor') {
          router.push(`/crossword/${state}`);
        } else {
          router.push(`/quiz/${state}`);
        }
      };

      const alreadyCompleted = gameState.completedStates.includes(state);
      if (alreadyCompleted) {
        Alert.alert(
          'Ulang Kuiz',
          'Anda telah melengkapkan negeri ini. Ulang kuiz?',
          [
            { text: 'Tidak', style: 'cancel' },
            {
              text: 'Ya',
              onPress: () => {
                // Reset previous run so quiz doesn't auto-complete on replay
                clearStateAnswers(state);
                setQuestionIndexForState(state, 0);
                proceed();
              },
            },
          ],
          { cancelable: true }
        );
      } else {
        proceed();
      }
    },
    [router, setCurrentState, clearStateTimer, clearStateAnswers, setQuestionIndexForState, gameState.completedStates],
  );

  const handleTutorial = useCallback(() => {
    playSound("click");
    router.push("/tutorial");
  }, [router]);

  // Handle topBar layout measurement
  const handleTopBarLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setTopBarHeight(height);
  }, []);

  // Show loading screen while GameContext initializes
  if (isLoading) {
    return (
      <ImageBackground
        source={ASSETS.shared.backgrounds.main}
        style={styles.container}
        resizeMode="cover"
      >
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
      source={ASSETS.shared.backgrounds.main}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Top Bar */}
      <View
        style={[
          styles.topBar,
          { top: insets.top + LAYOUT_CONFIG.topBarSpacing },
        ]}
        onLayout={handleTopBarLayout}
      >
        {/* Left Section - Tutorial */}
        <View style={styles.topBarLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.tutorialButtonCompact,
              { transform: [{ scale: pressed ? 0.96 : 1 }] },
            ]}
            onPress={handleTutorial}
            accessibilityRole="button"
            accessibilityLabel="Lihat tutorial permainan"
          >
            <Text
              style={styles.tutorialButtonText}
              allowFontScaling={allowScaling}
            >
              📖 Tutorial
            </Text>
          </Pressable>
        </View>

        {/* Center Spacer */}
        <View style={styles.topBarCenter} />

        {/* Right Section - Stats */}
        <View
          style={[styles.topBarRight, width < 375 && styles.topBarRightCompact]}
        >
          <View
            style={[styles.statItemCompact, width < 375 && styles.statItemTiny]}
          >
            <Text
              style={[
                styles.statTextCompact,
                width < 375 && styles.statTextTiny,
              ]}
              allowFontScaling={allowScaling}
            >
              {gameState.completedStates.length}/14
            </Text>
          </View>
        </View>
      </View>

      {/* Content Container */}
      <View
        style={[
          styles.contentContainer,
          { top: insets.top + LAYOUT_CONFIG.topBarSpacing + topBarHeight },
        ]}
      >
        {/* Warmup indicator (subtle) */}
        {isPreloading && (
          <View style={styles.warmupBadge}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.warmupText} allowFontScaling={allowScaling}>Memuatkan aset...</Text>
          </View>
        )}
        {/* Resume badge */}
        {(() => {
          const s = gameState.currentState as MalaysianState | null;
          if (!s) return null;
          if (gameState.completedStates.includes(s)) return null;
          const savedIdx = gameState.questionIndexByState?.[s];
          if (typeof savedIdx !== 'number') return null;
          const total = getQuestionsForState(s).length;
          if (total <= 0) return null;
          const nextQ = Math.min(savedIdx + 1, total);
          const name = s.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
          const label = `Sambung ${name} • Soalan ${nextQ}/${total}`;
          const onResume = () => {
            playSound('click');
            if (s === 'johor') router.push(`/crossword/${s}`);
            else router.push(`/quiz/${s}`);
          };
          return (
            <Pressable
              style={({ pressed }) => [
                styles.warmupBadge,
                { transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
              onPress={onResume}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Text
                style={styles.warmupText}
                allowFontScaling={allowScaling}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {label}
              </Text>
            </Pressable>
          );
        })()}
        {/* Error Banner */}
        {saveError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText} allowFontScaling={allowScaling}>
              {saveError}
            </Text>
          </View>
        )}

        {/* Map Board Container */}
        <View style={styles.mapBoardContainer}>
          <ImageBackground
            source={ASSETS.shared.backgrounds.board}
            style={[
              styles.mapBoard,
              getMapBoardSize(width),
            ]}
            resizeMode="contain"
          >
            {/* Map Title Header */}
            <View style={styles.mapTitleContainer}>
              <Text
                style={[
                  styles.mapTitleText,
                  { fontSize: getResponsiveFontSize('mapTitle', width) }
                ]}
                allowFontScaling={allowScaling}
              >
                PETA MALAYSIA
              </Text>
            </View>

            {/* Map View Container */}
            <View style={styles.mapViewContainer}>
              <MalaysiaMapSVG onStateSelect={handleStateSelect} />
            </View>
          </ImageBackground>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Content Container with explicit positioning
  contentContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // Map Board Container
  mapBoardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapBoard: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  // Map Title Container
  mapTitleContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
    marginTop: 12,
    marginBottom: 8,
    ...getComponentShadowStyle(Shadows.component.medium),
  },
  mapTitleText: {
    fontFamily: Typography.fontFamily,
    // fontSize applied inline via getResponsiveFontSize('mapTitle', width)
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    textAlign: "center",
    letterSpacing: 1,
  },
  // Map View Container - stretches to full height
  mapViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  // Error Banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244, 67, 54, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.medium,
    marginBottom: 12,
    gap: 8,
    ...getComponentShadowStyle(Shadows.component.medium),
  },
  errorIcon: {
    fontSize: 20,
  },
  errorText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: Colors.textLight,
  },

  warmupBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  warmupText: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: '#fff',
  },

  // Top Bar with minimum height (will expand with font scaling)
  topBar: {
    position: "absolute",
    left: 10,
    right: 10,
    minHeight: LAYOUT_CONFIG.minTopBarHeight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    zIndex: 100,
  },
  topBarLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  topBarCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  topBarRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  topBarRightCompact: {
    gap: 4, // Reduce gap on small screens
  },
  tutorialButtonCompact: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.medium,
    ...getComponentShadowStyle(Shadows.component.small),
  },
  tutorialButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: Typography.fontWeight.bold,
  },
  statItemCompact: {
    backgroundColor: Colors.semiTransparentCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.medium,
    ...getComponentShadowStyle(Shadows.component.small),
  },
  statTextCompact: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  statItemTiny: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statTextTiny: {
    fontSize: 10,
  },
});
