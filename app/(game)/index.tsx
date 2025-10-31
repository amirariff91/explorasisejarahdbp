import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { playSound } from "@/utils/audio";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Homepage / Splash Screen
 * Landing page with DBP logo, game title, and play button
 */
export default function Homepage() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = width > height;

  // Responsive sizing
  const logoSize = Math.min(width * 0.25, 140);
  const titleFontSize = Math.min(width * 0.162, isLandscape ? 86 : 102);
  const buttonWidth = Math.min(width * 0.22, 120);
  const buttonHeight = buttonWidth * 0.77; // Maintain aspect ratio

  const handlePlay = () => {
    playSound("click");
    router.push("/map");
  };

  return (
    <ImageBackground
      source={require("@/assets/images/game/backgrounds/bg-main.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* DBP Logo Container - Top Center */}
      <View
        style={[styles.logoOuterContainer, { top: insets.top + height * 0.05 }]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/game/LOGO DBP/logo-dbp.png")}
            style={[
              styles.logo,
              { width: logoSize, height: logoSize, borderRadius: logoSize / 2 },
            ]}
            contentFit="cover"
          />
        </View>
      </View>

      {/* Masthead Container - Center */}
      <View
        style={[
          styles.mastheadOuterContainer,
          { top: isLandscape ? "28%" : "35%" },
        ]}
      >
        <View style={styles.titleContainer}>
          <Image
            source={require("@/assets/images/game/MASTHEAD/TITLE.svg")}
            style={styles.masthead}
            contentFit="contain"
          />
          <Text
            style={[
              styles.titleText,
              {
                fontSize: titleFontSize,
                lineHeight: Math.max(titleFontSize * 1.12, titleFontSize + 16),
              },
            ]}
          >
            EXPLORASI{"\n"}SEJARAH
          </Text>
        </View>
      </View>

      {/* Button Container - Bottom Center */}
      <View
        style={[
          styles.buttonOuterContainer,
          { bottom: insets.bottom + height * 0.08 },
        ]}
      >
        <Pressable style={styles.nextButtonContainer} onPress={handlePlay}>
          <Image
            source={require("@/assets/images/game/buttons/next-button.png")}
            style={[
              styles.nextButton,
              { width: buttonWidth, height: buttonHeight },
            ]}
            contentFit="contain"
          />
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
    bottom: "60%",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 80,
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
  masthead: {
    width: "100%",
    height: 105,
    maxWidth: 245,
  },
  titleText: {
    position: "absolute",
    fontFamily: "Galindo",
    fontSize: 111,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 7,
    letterSpacing: 0,
    width: "100%",
    top: "18%",
  },

  // Button Outer Container
  buttonOuterContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: "50%",
    paddingBottom: 15,
  },
  nextButton: {
    width: 120,
    height: 92,
  },
});
