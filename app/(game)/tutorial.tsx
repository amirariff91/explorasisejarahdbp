import { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Typography } from '@/constants/theme';
import { useGameContext } from '@/contexts/GameContext';

/**
 * Tutorial Screens - Landscape Optimized (Figma Screens 3-4)
 * Left: Title + Visual (40% width)
 * Right: Description + Controls (60% width)
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
      title: 'Selamat Datang!',
      description:
        'Anda akan diberikan RM100 sebagai duit perjalanan, dan anda perlu melengkapkan perjalanan anda keseluruh negeri di dalam Malaysia. Jika jawapan anda salah RM2.00 akan ditolak.',
    },
    {
      title: 'Cara Bermain',
      description:
        'Pengembaraan bermula mengikut topik Sejarah dan pelajar perlu menyelesaikan setiap satu aras atau bahagian.',
    },
  ];

  const currentTutorial = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tutorial complete, mark as seen and navigate to map
      markTutorialComplete();
      router.replace('/');
    }
  };

  const edgeMargin = isLandscape ? 40 : 30;

  return (
    <ImageBackground
      source={require('@/assets/images/game/backgrounds/bg-main.png')}
      style={styles.container}
      resizeMode="cover">

      {/* Two-Column Layout: Title/Visual | Description/Controls */}
      <View style={[styles.twoColumnContainer, { paddingHorizontal: edgeMargin }]}>

        {/* Left Column: Title + Visual */}
        <View style={styles.leftColumn}>
          <ImageBackground
            source={require('@/assets/images/game/backgrounds/board-bg.png')}
            style={[
              styles.titleBoard,
              {
                width: isLandscape ? 380 : 300,
                height: isLandscape ? 160 : 200,
              },
            ]}
            resizeMode="contain">
            <View style={styles.titleContent}>
              <Text style={[styles.title, { fontSize: isLandscape ? 26 : 22 }]} allowFontScaling={allowScaling}>
                {currentTutorial.title}
              </Text>
              <Text style={[styles.stepText, { fontSize: isLandscape ? 15 : 13 }]} allowFontScaling={allowScaling}>
                {currentStep + 1} / {tutorialSteps.length}
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* Right Column: Description + Controls */}
        <View style={styles.rightColumn}>
          <View style={styles.rightContent}>
            {/* Description Board */}
            <ImageBackground
              source={require('@/assets/images/game/backgrounds/board-bg.png')}
              style={[
                styles.descriptionBoard,
                {
                  width: isLandscape ? 380 : 320,
                  height: isLandscape ? 200 : 180,
                },
              ]}
              resizeMode="contain">
              <View style={styles.boardContent}>
                <Text
                  style={[styles.description, { fontSize: isLandscape ? 17 : 16 }]}
                  numberOfLines={5}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                  allowFontScaling={allowScaling}>
                  {currentTutorial.description}
                </Text>
              </View>
            </ImageBackground>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {tutorialSteps.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { width: isLandscape ? 13 : 12, height: isLandscape ? 13 : 12 },
                    index === currentStep && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            {/* Next Button */}
            <Pressable
              style={[
                styles.nextButton,
                {
                  width: isLandscape ? 130 : 115,
                  height: isLandscape ? 90 : 80,
                },
              ]}
              onPress={handleNext}>
              <Image
                source={require('@/assets/images/game/buttons/next-button.png')}
                style={styles.nextButtonImage}
                contentFit="contain"
              />
              <Text
                style={[styles.nextButtonText, { fontSize: isLandscape ? 18 : 17 }]}
                allowFontScaling={allowScaling}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.75}
                ellipsizeMode="tail">
                {currentStep < tutorialSteps.length - 1 ? 'SETERUSNYA' : 'MULA'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Two-Column Layout
  twoColumnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    gap: 24,
  },

  // Left Column: Title
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBoard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContent: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  stepText: {
    fontFamily: Typography.fontFamily,
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },

  // Right Column: Description + Controls
  rightColumn: {
    flex: 1.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContent: {
    alignItems: 'center',
    gap: 20,
  },
  descriptionBoard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContent: {
    width: '85%',
    paddingVertical: 28,
  },
  description: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    lineHeight: 26,
  },
  stepIndicator: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 7,
    backgroundColor: '#ccc',
  },
  dotActive: {
    backgroundColor: '#4CAF50',
    width: 18,
  },
  nextButton: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  nextButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
