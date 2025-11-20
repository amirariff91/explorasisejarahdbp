import { Spacing, getQuestionBoardSize, getResponsiveSizeScaled } from "@/constants/layout";
import { Colors, getResponsiveFontSize } from "@/constants/theme";
import { ASSETS, ASSET_PRELOAD_CONFIG } from "@/constants/assets";
import { useGameContext } from "@/contexts/GameContext";
import { playMusic, playSound, stopMusic, stopAllAmbient } from "@/utils/audio";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { preloadAssets } from "@/utils/preload-assets";
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
    ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/**
 * Tutorial Screens - Centered Single-Column Layout
 * Displays tutorial description with step indicators and navigation
 */
export default function TutorialScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { markTutorialComplete } = useGameContext();
  const [currentStep, setCurrentStep] = useState(0);
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const [isPreloading, setIsPreloading] = useState(false);

  // Animation values
  const buttonScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);

  const tutorialSteps = [
    {
      title: "Selamat Datang!",
      description:
        "Mari menjelajah sejarah 14 buah negeri di Malaysia. Setiap negeri mengandungi topik sejarah yang berbeza. Anda perlu menyelesaikan semua soalan.",
    },
    {
      title: "Cara Bermain",
      description:
        "Pengembaraan bermula mengikut topik Sejarah dan pelajar perlu menyelesaikan setiap satu aras atau bahagian.",
    },
  ];

  const currentTutorial = tutorialSteps[currentStep];

  // Play tutorial background music on mount
  useEffect(() => {
    // Stop any ambient layers from previous screens to prevent overlapping background audio
    stopAllAmbient();

    // Start dedicated tutorial background music with a gentle fade-in
    playMusic('bgm-tutorial', true, 2000); // Fade in over 2 seconds

    // Fade out tutorial music and clear ambient when leaving tutorial to avoid double background tracks
    return () => {
      stopMusic(500);
      stopAllAmbient();
    };
  }, []);

  // Preload commonly used UI assets during tutorial
  useEffect(() => {
    setIsPreloading(true);
    preloadAssets(ASSET_PRELOAD_CONFIG.preload)
      .catch(() => {})
      .finally(() => setIsPreloading(false));
  }, []);

  // Button breathing animation
  useEffect(() => {
    buttonScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200 }),
        withTiming(1, { duration: 1200 })
      ),
      -1,
      false
    );
  }, []);

  // Content fade-in on mount and step change
  useEffect(() => {
    contentOpacity.value = 0;
    contentOpacity.value = withTiming(1, { duration: 400 });
  }, [currentStep]);

  const handleNext = () => {
    playSound('click'); // UI feedback

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial complete, mark as seen and navigate to map
      markTutorialComplete();
      router.replace("/map");
    }
  };

  const handleBack = () => {
    playSound('click');
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    playSound('click');
    markTutorialComplete();
    router.replace("/map");
  };

  const edgeMargin = getResponsiveSizeScaled(40, width);
  const boardSize = (() => {
    const base = getQuestionBoardSize('standard', width); // Use larger 'standard' board (480×300 base)
    const isPhone = width < 1000; // Aligns with device breakpoints (phone < 1000px)
    return isPhone
      ? { width: base.width * 1.1, height: base.height * 1.1 } // 10% larger on phones
      : base;
  })();
  const verticalPadding = getResponsiveSizeScaled(boardSize.height * 0.12, width); // 12% of board height
  const horizontalPadding = getResponsiveSizeScaled(boardSize.width * 0.10, width); // 10% of board width

  // Animated styles
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  return (
    <ImageBackground
      source={ASSETS.shared.backgrounds.main}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Skip button - Top Right */}
      <Pressable
        style={[styles.skipButton, {
          top: getResponsiveSizeScaled(16, width),
          right: getResponsiveSizeScaled(16, width),
          paddingHorizontal: getResponsiveSizeScaled(16, width),
          paddingVertical: getResponsiveSizeScaled(8, width),
          borderRadius: getResponsiveSizeScaled(20, width),
        }]}
        onPress={handleSkip}
        accessibilityRole="button"
        accessibilityLabel="Langkau tutorial"
      >
        <Text
          style={[styles.skipButtonText, { fontSize: getResponsiveFontSize('clue', width) }]}
          allowFontScaling={allowScaling}
        >
          Langkau →
        </Text>
      </Pressable>

      {/* Warmup indicator (subtle) */}
      {isPreloading && (
        <View style={[styles.warmupBadge, {
          top: getResponsiveSizeScaled(16, width),
          left: getResponsiveSizeScaled(16, width),
          paddingHorizontal: getResponsiveSizeScaled(10, width),
          paddingVertical: getResponsiveSizeScaled(6, width),
          borderRadius: getResponsiveSizeScaled(12, width),
          gap: getResponsiveSizeScaled(6, width),
        }]}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={[styles.warmupText, { fontSize: getResponsiveSizeScaled(12, width) }]} allowFontScaling={allowScaling}>Memuatkan aset...</Text>
        </View>
      )}

      {/* Single-Column Layout: Description + Controls */}
      <View
        style={[styles.contentContainer, {
          paddingHorizontal: edgeMargin,
          paddingTop: getResponsiveSizeScaled(Spacing.xxxl, width),
          paddingBottom: getResponsiveSizeScaled(Spacing.xxxl, width),
        }]}
      >
        {/* Description Board Container */}
        <Animated.View style={[styles.boardContainer, contentAnimatedStyle]}>
          <ImageBackground
            source={ASSETS.shared.backgrounds.board}
            style={[
              styles.descriptionBoard,
              boardSize,
            ]}
            resizeMode="contain"
          >
            <View style={[styles.boardContent, {
              paddingTop: verticalPadding,
              paddingBottom: verticalPadding,
              paddingHorizontal: horizontalPadding,
            }]}>
              {/* Title */}
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: getResponsiveFontSize('question', width),
                    lineHeight: getResponsiveFontSize('question', width) * 1.4,
                    marginBottom: getResponsiveSizeScaled(16, width),
                  },
                ]}
                allowFontScaling={allowScaling}
              >
                {currentTutorial.title}
              </Text>

              {/* Description */}
              <Text
                style={[
                  styles.description,
                  {
                    fontSize: getResponsiveFontSize('answer', width),
                    lineHeight: getResponsiveFontSize('answer', width) * 1.6,
                  },
                ]}
                numberOfLines={8}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                allowFontScaling={allowScaling}
              >
                {currentTutorial.description}
              </Text>
            </View>
          </ImageBackground>
        </Animated.View>

        {/* Step Indicators removed per request */}

        {/* Navigation Buttons Container */}
        <View style={[styles.buttonContainer, {
          marginTop: getResponsiveSizeScaled(Spacing.xl, width),
        }]}>
          {/* Back Button */}
          {currentStep > 0 && (
            <Pressable
              style={[
                styles.backButton,
                {
                  width: getResponsiveSizeScaled(100, width),
                  height: getResponsiveSizeScaled(70, width),
                  marginRight: getResponsiveSizeScaled(20, width),
                },
              ]}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Kembali ke langkah sebelumnya"
            >
              <Image
                source={ASSETS.shared.buttons.menu.default}
                style={styles.backButtonImage}
                contentFit="contain"
              />
            </Pressable>
          )}

          {/* Next/Start Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel={currentStep === tutorialSteps.length - 1 ? "Mula permainan" : "Seterusnya"}
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <View style={[styles.teruskanTextButton, {
                  paddingVertical: getResponsiveSizeScaled(14, width),
                  paddingHorizontal: getResponsiveSizeScaled(28, width),
                  borderRadius: getResponsiveSizeScaled(12, width),
                  minWidth: getResponsiveSizeScaled(120, width),
                  minHeight: getResponsiveSizeScaled(50, width),
                }]}>
                  <Text
                    style={[
                      styles.teruskanButtonText,
                      { fontSize: getResponsiveFontSize('answer', width) }
                    ]}
                    allowFontScaling={allowScaling}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.8}
                    numberOfLines={1}
                  >
                    TERUSKAN
                  </Text>
                </View>
              ) : (
                <View style={[
                  styles.nextButton,
                  {
                    width: getResponsiveSizeScaled(115, width),
                    height: getResponsiveSizeScaled(80, width),
                  },
                ]}>
                  <Image
                    source={ASSETS.shared.buttons.next.default}
                    style={styles.nextButtonImage}
                    contentFit="contain"
                  />
                </View>
              )}
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Skip Button (Top-Right)
  skipButton: {
    position: 'absolute',
    backgroundColor: Colors.backgroundOverlay,
    zIndex: 10,
    // top, right, padding, borderRadius set inline dynamically
  },
  skipButtonText: {
    fontFamily: "Galindo",
    color: Colors.textLight,
    // fontSize set inline dynamically
  },

  // Warmup Indicator (Top-Left)
  warmupBadge: {
    position: 'absolute',
    backgroundColor: Colors.backgroundOverlay,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    // top, left, padding, borderRadius, gap set inline dynamically
  },
  warmupText: {
    fontFamily: "Galindo",
    color: Colors.textLight,
    // fontSize set inline dynamically
  },

  // Single-Column Flex Layout
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal, paddingTop, paddingBottom set inline dynamically
  },

  // Board Container
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  descriptionBoard: {
    alignItems: "center",
    justifyContent: "center",
  },
  boardContent: {
    width: "80%",
    alignItems: "center",
    // paddingTop, paddingBottom, paddingHorizontal set inline dynamically
  },

  // Title Text
  title: {
    fontFamily: "Galindo",
    color: Colors.textPrimary,
    textAlign: "center",
    fontWeight: "normal", // Changed from bold - Galindo only has 400 Regular weight
    // fontSize, lineHeight, marginBottom set inline dynamically
  },

  // Description Text
  description: {
    fontFamily: "Galindo",
    color: Colors.textPrimary,
    textAlign: "center",
    maxWidth: "100%",
    // fontSize, lineHeight set inline dynamically
  },

  // Button Container (Horizontal Layout)
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // marginTop set inline dynamically
  },

  // Back Button
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    // width, height, marginRight set inline dynamically
  },
  backButtonImage: {
    width: "75%",
    height: "75%",
  },

  // Next/Start Button
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
    // width, height set inline dynamically
  },
  nextButtonImage: {
    width: "75%",
    height: "75%",
  },

  // TERUSKAN Text Button
  teruskanTextButton: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical, paddingHorizontal, borderRadius set inline dynamically
  },
  teruskanButtonText: {
    fontFamily: "Galindo",
    color: Colors.textLight,
    textAlign: "center",
    fontWeight: "normal",
    // fontSize set inline dynamically
  },
});
