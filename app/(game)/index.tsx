import {
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  useWindowDimensions,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { ASSETS } from "@/constants/assets";
import { playSound, playMusic, playAmbient, stopMusic, stopAllAmbient } from "@/utils/audio";
import { useGameContext } from "@/contexts/GameContext";
import { isLandscapeMode, getResponsiveSizeScaled } from "@/constants/layout";

/**
 * Homepage / Splash Screen
 * Landing page with DBP logo, game title, and play button
 */
export default function Homepage() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { gameState } = useGameContext();
  const isLandscape = isLandscapeMode(width); // Standardized landscape detection (800px breakpoint)

  // Button breathing animation
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Responsive sizing using scale factors (auto-scales by device tier)
  // Logo: 95×130px (Figma spec), max 1.5× scale
  const logoWidth = getResponsiveSizeScaled(95, width, 1.5);   // Max 142px on iPad Pro
  const logoHeight = getResponsiveSizeScaled(130, width, 1.5); // Max 195px on iPad Pro

  // Button: 144×110px (Figma spec), max 1.5× scale
  const buttonWidth = getResponsiveSizeScaled(144, width, 1.5);  // Max 216px on iPad Pro
  const buttonHeight = getResponsiveSizeScaled(110, width, 1.5); // Max 165px on iPad Pro

  // Masthead: 564×242px (Figma spec), max 1.8× scale for prominent title
  const mastheadWidth = getResponsiveSizeScaled(564, width, 1.8);   // Max 1015px on iPad Pro
  const mastheadHeight = getResponsiveSizeScaled(242, width, 1.8);  // Max 436px on iPad Pro

  // Vertical responsiveness: scale content so it fits short phone heights (e.g. Pixel 8a landscape)
  const availableHeight = height;
  const baseTopPadding = getResponsiveSizeScaled(isLandscape ? 16 : 24, width);
  const baseBottomPadding = getResponsiveSizeScaled(isLandscape ? 24 : 32, width);
  const baseLogoPaddingVertical = 20; // logoContainer paddingTop + paddingBottom
  const baseTitlePaddingVertical = 40; // titleContainer paddingTop + paddingBottom

  const baseContentHeight =
    baseTopPadding +
    baseBottomPadding +
    baseLogoPaddingVertical +
    logoHeight +
    baseTitlePaddingVertical +
    mastheadHeight +
    buttonHeight;

  const verticalScale =
    availableHeight > 0
      ? Math.min(1, availableHeight / baseContentHeight)
      : 1;
  const paddingScale = verticalScale;

  // Rebalance vertical space between elements on short screens:
  // Make the title masthead slightly larger, and logo/button slightly smaller,
  // while keeping the total height <= the uniformly-scaled layout.
  const useRebalancedScales = verticalScale < 0.99;
  const logoScale = useRebalancedScales ? verticalScale * 0.8 : 1;
  const mastheadScale = useRebalancedScales ? verticalScale * 1.2 : 1;
  const buttonSizeScale = useRebalancedScales ? verticalScale * 0.7 : 1;

  // Play welcome background music and ambient on mount with synchronized SFX
  useEffect(() => {
    // Logo reveal sound when component mounts
    const logoTimer = setTimeout(() => {
      playSound('logo-reveal'); // Magical whoosh for logo appearance
    }, 500);

    // Title drop sound when title appears
    const titleTimer = setTimeout(() => {
      playSound('title-drop'); // Resonant gong for majestic title reveal
    }, 1500);

    // Background music starts with fade-in
    const bgmTimer = setTimeout(() => {
      playMusic('bgm-title', true, 3000); // Dedicated title theme with 3s fade-in
      playAmbient('ambient-map', 0.1); // Very subtle tropical ambience (10% volume)
    }, 2000); // Delay music slightly to let SFX shine

    // Start gentle breathing animation for play button (kid-friendly)
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 1.08, // Subtle scale up
          duration: 1250, // 1.25 seconds
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1.0, // Back to normal
          duration: 1250, // 1.25 seconds
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(titleTimer);
      clearTimeout(bgmTimer);
      // No stopMusic needed - next screen's playMusic() will handle transition
      stopAllAmbient();
    };
  }, [buttonScale]);

  // Button press handlers for tactile feedback
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95, // Slightly squish
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1.08, // Return to breathing animation state
      friction: 3, // Bouncy feel
      useNativeDriver: true,
    }).start();
  };

  const handlePlay = () => {
    playSound("star"); // Celebratory sound for starting the educational journey
    // Check if player profile exists
    if (!gameState.playerProfile) {
      router.push("/log-masuk");
    } else {
      router.push("/map");
    }
  };

  return (
    <ImageBackground
      source={ASSETS.shared.backgrounds.main}
      style={styles.container}
      resizeMode="cover"
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: baseTopPadding * paddingScale,
            paddingBottom:
              baseBottomPadding * paddingScale +
              getResponsiveSizeScaled(4, width), // small cushion above Android nav bar
          },
        ]}
      >
        {/* Top Stack: Logo + Title */}
        <View style={styles.topSection}>
          {/* DBP Logo */}
          <View style={styles.logoOuterContainer}>
            <View
              style={[
                styles.logoContainer,
                { paddingVertical: 10 * paddingScale },
              ]}
            >
              <Image
                source={ASSETS.branding.logoDbp}
                style={{
                  width: logoWidth * logoScale,
                  height: logoHeight * logoScale,
                }}
                contentFit="contain"
              />
            </View>
          </View>

          {/* Masthead */}
          <View style={styles.mastheadOuterContainer}>
            <View
              style={[
                styles.titleContainer,
                { paddingVertical: 20 * paddingScale },
              ]}
            >
              <Image
                source={ASSETS.branding.titleMasthead}
                style={{
                  width: mastheadWidth * mastheadScale,
                  height: mastheadHeight * mastheadScale,
                }}
                contentFit="contain"
                cachePolicy="memory-disk"
                priority="high"
                transition={200}
              />
            </View>
          </View>
        </View>

        {/* Button Container - Bottom with Breathing Animation */}
        <View style={styles.buttonOuterContainer}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePlay}
            accessibilityRole="button"
            accessibilityLabel="Mula bermain"
          >
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <Image
                source={ASSETS.shared.buttons.next.default}
                style={{
                  width: buttonWidth * buttonSizeScale,
                  height: buttonHeight * buttonSizeScale,
                }}
                contentFit="contain"
              />
            </Animated.View>
          </Pressable>
        </View>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
  },

  // Logo Outer Container
  logoOuterContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    // Dimensions set dynamically via inline styles
  },

  // Masthead Outer Container
  mastheadOuterContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    maxWidth: "95%",
    position: "relative",
  },

  // Button Outer Container
  buttonOuterContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
