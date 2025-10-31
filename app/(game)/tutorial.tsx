import { useState } from "react";
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
import { Typography } from "@/constants/theme";
import { useGameContext } from "@/contexts/GameContext";

/**
 * Tutorial Screens - Centered Single-Column Layout
 * Displays tutorial description with step indicators and navigation
 */
export default function TutorialScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { markTutorialComplete } = useGameContext();
  const [currentStep, setCurrentStep] = useState(0);
  const isLandscape = width >= 800; // Landscape mode threshold (Figma: 895px)
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;

  const tutorialSteps = [
    {
      title: "Selamat Datang!",
      description:
        "Anda akan diberikan RM100 sebagai duit perjalanan, dan anda perlu melengkapkan perjalanan anda keseluruh negeri di dalam Malaysia. Jika jawapan anda salah RM2.00 akan ditolak.",
    },
    {
      title: "Cara Bermain",
      description:
        "Pengembaraan bermula mengikut topik Sejarah dan pelajar perlu menyelesaikan setiap satu aras atau bahagian.",
    },
  ];

  const currentTutorial = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial complete, mark as seen and navigate to map
      markTutorialComplete();
      router.replace("/");
    }
  };

  const edgeMargin = isLandscape ? 40 : 30;

  return (
    <ImageBackground
      source={require("@/assets/images/game/backgrounds/bg-main.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Single-Column Layout: Description + Controls */}
      <View
        style={[styles.contentContainer, { paddingHorizontal: edgeMargin }]}
      >
        {/* Description Board Container */}
        <View style={styles.boardContainer}>
          <ImageBackground
            source={require("@/assets/images/game/backgrounds/board-bg.png")}
            style={[
              styles.descriptionBoard,
              {
                width: isLandscape ? 762 : 549,
                height: isLandscape ? 381 : 335,
              },
            ]}
            resizeMode="contain"
          >
            <View style={styles.boardContent}>
              <Text
                style={[
                  styles.description,
                  { fontSize: isLandscape ? 18 : 17 },
                ]}
                numberOfLines={9}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                allowFontScaling={allowScaling}
              >
                {currentTutorial.description}
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Next Button Container */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.nextButton,
              {
                width: isLandscape ? 130 : 115,
                height: isLandscape ? 90 : 80,
              },
            ]}
            onPress={handleNext}
          >
            <Image
              source={require("@/assets/images/game/buttons/next-button.png")}
              style={styles.nextButtonImage}
              contentFit="contain"
            />
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

  // Single-Column Layout
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: "20%",
    paddingBottom: 40,
  },

  // Board Container
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  descriptionBoard: {
    alignItems: "center",
    justifyContent: "center",
  },
  boardContent: {
    width: "50%",
    paddingTop: 46,
    paddingBottom: 46,
    paddingLeft: 27,
    paddingRight: 27,
    alignItems: "center",
  },
  description: {
    fontFamily: "Galindo",
    fontSize: 8,
    color: "#000",
    textAlign: "center",
    lineHeight: 30,
    maxWidth: "100%",
  },

  // Button Container
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    left: "25%",
    top: "-45%",
  },
  nextButton: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonImage: {
    width: "75%",
    height: "75%",
  },
});
