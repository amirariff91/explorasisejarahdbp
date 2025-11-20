import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { ASSETS } from '@/constants/assets';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography, getResponsiveFontSize, getTextShadowStyle, Shadows, getComponentShadowStyle } from '@/constants/theme';
import { ButtonSizes, TouchTargets, Spacing, getResponsiveSizeScaled } from '@/constants/layout';
import type { CongratsOverlayProps } from '@/types';

// Confetti colors - celebratory palette
const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
];

// Generate confetti particle configurations
function generateConfettiParticles(count: number, screenWidth: number, screenHeight: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * screenWidth,
    delay: Math.random() * 800,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
    size: 8 + Math.random() * 8, // 8-16px
    drift: (Math.random() - 0.5) * 100, // Horizontal drift
  }));
}

// Individual confetti particle component
function ConfettiParticle({
  particle,
  visible,
  screenHeight,
}: {
  particle: ReturnType<typeof generateConfettiParticles>[0];
  visible: boolean;
  screenHeight: number;
}) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animate falling
      translateY.value = withDelay(
        particle.delay,
        withTiming(screenHeight + 100, {
          duration: 3000 + Math.random() * 1000,
          easing: Easing.out(Easing.quad),
        })
      );

      // Horizontal drift
      translateX.value = withDelay(
        particle.delay,
        withTiming(particle.drift, {
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
        })
      );

      // Rotation
      rotate.value = withDelay(
        particle.delay,
        withTiming(particle.rotation + 720, {
          duration: 3000,
          easing: Easing.linear,
        })
      );

      // Fade in then out
      opacity.value = withDelay(
        particle.delay,
        withTiming(1, { duration: 200 })
      );
    } else {
      translateY.value = -50;
      translateX.value = 0;
      rotate.value = 0;
      opacity.value = 0;
    }
  }, [visible, particle, screenHeight, translateY, translateX, rotate, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.confettiParticle,
        {
          left: particle.x,
          width: particle.size,
          height: particle.size * 0.6,
          backgroundColor: particle.color,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
      pointerEvents="none"
    />
  );
}

const BUTTON_ASSET = ASSETS.games.dbpSejarah.buttonTeruskan.default;

export default function CongratsOverlay({
  visible,
  title = 'TAHNIAH',
  reward,
  continueLabel = 'TERUSKAN',
  restartLabel = 'ULANG SEMULA',
  allowFontScaling = false,
  onContinue,
  onRestart,
}: CongratsOverlayProps) {
  const { width, height } = useWindowDimensions();

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(40);

  // Generate confetti particles
  const confettiParticles = useMemo(
    () => generateConfettiParticles(30, width, height),
    [width, height]
  );

  useEffect(() => {
    if (visible) {
      // Content fade & slide: Smooth entrance
      contentOpacity.value = withTiming(1, { duration: 400 });
      contentTranslateY.value = withSpring(0, { damping: 14, stiffness: 150 });
    } else {
      contentOpacity.value = 0;
      contentTranslateY.value = 40;
    }
  }, [visible, contentOpacity, contentTranslateY]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  // Use responsive scaling for success modal elements (4-tier system)
  const buttonDimensions = {
    width: getResponsiveSizeScaled(ButtonSizes.successAction.portrait.width, width),
    height: getResponsiveSizeScaled(ButtonSizes.successAction.portrait.height, width),
  };

  const renderReward = () => {
    if (!reward) return null;

    return typeof reward === 'string' ? (
      <Text
        style={[styles.rewardText, { fontSize: getResponsiveFontSize('answer', width) }]}
        allowFontScaling={allowFontScaling}
      >
        {reward}
      </Text>
    ) : (
      <View style={styles.rewardCustom}>{reward}</View>
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="auto">
      {/* Confetti particles */}
      {confettiParticles.map((particle) => (
        <ConfettiParticle
          key={particle.id}
          particle={particle}
          visible={visible}
          screenHeight={height}
        />
      ))}

      <Animated.View style={[styles.panelWrapper, { paddingTop: getResponsiveSizeScaled(60, width) }, contentAnimatedStyle]}>
        <View style={[
          styles.panelBackground, 
          { 
            padding: getResponsiveSizeScaled(32, width),
            minWidth: Math.min(width * 0.6, 500)
          }
        ]}>
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                { fontSize: getResponsiveFontSize('stateLabel', width) },
              ]}
              allowFontScaling={allowFontScaling}
            >
              {title}
            </Text>

          {renderReward()}

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.primaryButton, buttonDimensions]}
              onPress={onContinue}
              hitSlop={TouchTargets.hitSlop}
            >
              <Image source={BUTTON_ASSET} style={styles.buttonImage} contentFit="contain" />
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontSize: getResponsiveFontSize('answer', width),
                    paddingHorizontal: getResponsiveSizeScaled(12, width),
                  },
                ]}
                allowFontScaling={allowFontScaling}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {continueLabel}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton, buttonDimensions]}
              onPress={onRestart}
              hitSlop={TouchTargets.hitSlop}
            >
              <Image source={BUTTON_ASSET} style={styles.buttonImage} contentFit="contain" />
              <Text
                style={[
                  styles.buttonText,
                  styles.secondaryButtonText,
                  {
                    fontSize: getResponsiveFontSize('answer', width),
                    paddingHorizontal: getResponsiveSizeScaled(12, width),
                  },
                ]}
                allowFontScaling={allowFontScaling}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {restartLabel}
              </Text>
            </Pressable>
          </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    overflow: 'hidden',
  },
  confettiParticle: {
    position: 'absolute',
    top: 0,
  },
  panelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xxxl * 1.5,
    paddingHorizontal: Spacing.xxxl,
  },
  panelBackground: {
    backgroundColor: '#5D4037', // Wood color
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FFD700', // Gold border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
    gap: Spacing.lg,
    zIndex: 2,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal,
    color: '#FFD700', // Gold
    letterSpacing: 1.5,
    ...getTextShadowStyle(Shadows.text.strong),
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  rewardText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 24,
    opacity: 0.9,
  },
  rewardCustom: {
    alignItems: 'center',
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.xxl,
    marginTop: Spacing.md,
  },
  button: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {},
  secondaryButton: {
    opacity: 0.9,
  },
  buttonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textLight,
    ...getTextShadowStyle(Shadows.text.medium),
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: Colors.textLight,
    opacity: 0.95,
  },
});
