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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGameContext } from "@/contexts/GameContext";
import { isLandscapeMode, getResponsiveSizeScaled } from "@/constants/layout";

/**
 * Homepage / Splash Screen
 * Landing page with DBP logo, game title, and play button
 */
export default function Homepage() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
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

  const logoTop = insets.top + height * 0.05;
  const titleTop = logoTop + logoHeight + (isLandscape ? height * 0.08 : height * 0.12);
  const buttonBottom = insets.bottom + height * 0.08;

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
      stopMusic(1500); // Smooth 1.5s fade-out when leaving
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
      {/* DBP Logo Container - Top Center */}
      <View style={[styles.logoOuterContainer, { top: logoTop }]}>
        <View style={styles.logoContainer}>
          <Image
            source={ASSETS.branding.logoDbp}
            style={[
              styles.logo,
              { width: logoWidth, height: logoHeight },
            ]}
            contentFit="contain"
          />
        </View>
      </View>

      {/* Masthead Container - Center */}
      <View style={[styles.mastheadOuterContainer, { top: titleTop }]}>
        <View style={styles.titleContainer}>
          <Image
            source={ASSETS.branding.titleMasthead}
            style={{
              width: mastheadWidth,
              height: mastheadHeight,
            }}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
            transition={200}
          />
        </View>
      </View>

      {/* Button Container - Bottom Center with Breathing Animation */}
      <View style={[styles.buttonOuterContainer, { bottom: buttonBottom }]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePlay}
        >
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Image
              source={ASSETS.shared.buttons.next.default}
              style={{ width: buttonWidth, height: buttonHeight }}
              contentFit="contain"
            />
          </Animated.View>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // Logo Outer Container
  logoOuterContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    // top is set dynamically via inline styles
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
    position: "absolute",
    left: 0,
    right: 0,
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
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    // bottom is set dynamically via inline styles
  },
});
