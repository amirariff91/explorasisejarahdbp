import { Spacing } from "@/constants/layout";
import { Colors } from "@/constants/theme";
import { useGameContext } from "@/contexts/GameContext";
import { playMusic, playSound, playTutorialNarration, stopMusic } from "@/utils/audio";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

/**
 * Tutorial Screens - Centered Single-Column Layout
 * Displays tutorial description with step indicators and navigation
 */
export default function TutorialScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { markTutorialComplete } = useGameContext();
  const [currentStep, setCurrentStep] = useState(0);
  const isLandscape = width >= 800; // Landscape mode threshold (800px standardized breakpoint)
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

  // Play tutorial background music on mount
  useEffect(() => {
    playMusic('bgm-tutorial', true, 2000); // Fade in over 2 seconds

    return () => {
      stopMusic(1000); // Fade out when leaving tutorial
    };
  }, []);

  // Play voice narration when step changes
  useEffect(() => {
    playTutorialNarration(currentStep);
  }, [currentStep]);

  const handleNext = () => {
    playSound('click'); // UI feedback
    
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
                width: isLandscape ? 600 : 460,
                height: isLandscape ? 300 : 280,
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

  // Single-Column Flex Layout (Replaced absolute positioning)
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },

  // Board Container
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  descriptionBoard: {
    alignItems: "center",
    justifyContent: "center",
  },
  boardContent: {
    width: "70%",  // More text space with smaller board
    paddingTop: 46,
    paddingBottom: 46,
    paddingHorizontal: 27,
    alignItems: "center",
  },
  description: {
    fontFamily: "Galindo",
    fontSize: 8,
    color: Colors.textPrimary,
    textAlign: "center",
    lineHeight: 30,
    maxWidth: "100%",
  },

  // Button Container (Flex-based positioning)
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  nextButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonImage: {
    width: "75%",
    height: "75%",
  },
});
