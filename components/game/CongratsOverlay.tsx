import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Typography, getResponsiveFontSize, getTextShadowStyle, Shadows, getComponentShadowStyle } from '@/constants/theme';
import { ButtonSizes, TouchTargets, UIElements, isLandscapeMode } from '@/constants/layout';
import type { CongratsOverlayProps } from '@/types';

function useSparkleAnimation(visible: boolean, delay: number) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 700 })
          ),
          -1,
          true
        )
      );

      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1.1, { duration: 600 }),
            withTiming(0.9, { duration: 700 })
          ),
          -1,
          true
        )
      );
    } else {
      opacity.value = 0;
      scale.value = 0.8;
    }
  }, [visible, delay, opacity, scale]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
}

const STAR_ASSET = require('@/assets/images/game/ui-elements/star.png');
const PANEL_ASSET = require('@/assets/images/game/ui-elements/tahniah-bg.png');
const BUTTON_ASSET = require('@/assets/images/game/ui-elements/button-teruskan.png');
const FLARE_ASSET = require('@/assets/images/game/ui-elements/flare.png');

export default function CongratsOverlay({
  visible,
  title = 'TAHNIAH',
  stars = 3,
  reward,
  continueLabel = 'TERUSKAN',
  restartLabel = 'ULANG SEMULA',
  allowFontScaling = false,
  onContinue,
  onRestart,
}: CongratsOverlayProps) {
  const { width } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);

  const starScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(40);
  const flareScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      starScale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 120 }),
        withSpring(1, { damping: 10, stiffness: 160 })
      );

      contentOpacity.value = withTiming(1, { duration: 450 });
      contentTranslateY.value = withSpring(0, { damping: 12, stiffness: 140 });
      flareScale.value = withTiming(1, { duration: 700 });
    } else {
      starScale.value = 0;
      contentOpacity.value = 0;
      contentTranslateY.value = 40;
      flareScale.value = 0;
    }
  }, [visible, starScale, contentOpacity, contentTranslateY, flareScale]);

  const flareAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flareScale.value }],
    opacity: flareScale.value * 0.8,
  }));

  const starGroupAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: Math.max(starScale.value, 0) }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const sparkleStyle0 = useSparkleAnimation(visible, 0);
  const sparkleStyle1 = useSparkleAnimation(visible, 150);
  const sparkleStyle2 = useSparkleAnimation(visible, 320);
  const sparkleStyle3 = useSparkleAnimation(visible, 480);
  const sparkleStyle4 = useSparkleAnimation(visible, 640);
  const sparkleStyle5 = useSparkleAnimation(visible, 800);
  const sparkleStyles = [
    sparkleStyle0,
    sparkleStyle1,
    sparkleStyle2,
    sparkleStyle3,
    sparkleStyle4,
    sparkleStyle5,
  ];

  const sparkleSpots = useMemo(
    () =>
      (isLandscape
        ? [
            { top: '18%', left: '18%', size: 10 },
            { top: '24%', right: '14%', size: 12 },
            { bottom: '22%', left: '12%', size: 8 },
            { bottom: '18%', right: '20%', size: 9 },
            { top: '28%', left: '50%', size: 11 },
            { bottom: '12%', left: '50%', size: 10 },
          ]
        : [
            { top: '20%', left: '22%', size: 10 },
            { top: '26%', right: '18%', size: 12 },
            { bottom: '28%', left: '18%', size: 9 },
            { bottom: '20%', right: '22%', size: 8 },
            { top: '34%', left: '50%', size: 11 },
            { bottom: '14%', left: '48%', size: 10 },
          ]) as const,
    [isLandscape]
  );

  const starDimensions = isLandscape
    ? UIElements.successModal.star.landscape
    : UIElements.successModal.star.portrait;
  const panelDimensions = isLandscape
    ? UIElements.successModal.tahniahBg.landscape
    : UIElements.successModal.tahniahBg.portrait;
  const buttonDimensions = isLandscape
    ? ButtonSizes.successAction.landscape
    : ButtonSizes.successAction.portrait;

  const clampedStars = Math.max(1, Math.min(3, Math.round(stars)));

  const renderReward = () => {
    if (!reward) return null;

    return typeof reward === 'string' ? (
      <Text style={styles.rewardText} allowFontScaling={allowFontScaling}>
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
      <Animated.View style={[styles.flareContainer, flareAnimatedStyle]}>
        <Image source={FLARE_ASSET} style={styles.flare} contentFit="contain" />
      </Animated.View>

      {sparkleSpots.map((spot, index) => {
        const { size, ...position } = spot;
        return (
          <Animated.View
            key={`sparkle-${index}`}
            style={[
              styles.sparkle,
              position,
              { width: size, height: size, borderRadius: size / 2 },
              sparkleStyles[index],
            ]}
          />
        );
      })}

      <Animated.View style={[styles.panelWrapper, contentAnimatedStyle]}>
        <Image
          source={PANEL_ASSET}
          style={[
            styles.panelImage,
            { width: panelDimensions.width, height: panelDimensions.height },
          ]}
          contentFit="contain"
        />

        <Animated.View style={[styles.starGroup, starGroupAnimatedStyle]}>
          {clampedStars >= 2 && (
            <Image
              key="star-left"
              source={STAR_ASSET}
              style={[
                styles.star,
                {
                  width: starDimensions.width * 0.85,
                  height: starDimensions.height * 0.85,
                  transform: [{ rotate: '-8deg' }, { scale: 0.85 }],
                },
              ]}
              contentFit="contain"
            />
          )}

          <Image
            key="star-center"
            source={STAR_ASSET}
            style={[
              styles.star,
              {
                width: starDimensions.width,
                height: starDimensions.height,
                marginHorizontal: 12,
              },
            ]}
            contentFit="contain"
          />

          {clampedStars >= 3 && (
            <Image
              key="star-right"
              source={STAR_ASSET}
              style={[
                styles.star,
                {
                  width: starDimensions.width * 0.85,
                  height: starDimensions.height * 0.85,
                  transform: [{ rotate: '8deg' }, { scale: 0.85 }],
                },
              ]}
              contentFit="contain"
            />
          )}
        </Animated.View>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { fontSize: getResponsiveFontSize(Typography.title, isLandscape) + 6 },
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
                  { fontSize: getResponsiveFontSize(Typography.button, isLandscape) },
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
                  { fontSize: getResponsiveFontSize(Typography.button, isLandscape) },
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  panelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingBottom: 48,
    paddingHorizontal: 32,
  },
  panelImage: {
    position: 'absolute',
    ...getComponentShadowStyle(Shadows.component.large),
  },
  content: {
    alignItems: 'center',
    gap: 16,
    zIndex: 2,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    letterSpacing: 1.5,
    ...getTextShadowStyle(Shadows.text.medium),
  },
  rewardText: {
    fontFamily: Typography.fontFamily,
    fontSize: 18,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  rewardCustom: {
    alignItems: 'center',
  },
  buttons: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
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
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    ...getTextShadowStyle(Shadows.text.medium),
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#E2ECFF',
  },
  starGroup: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  star: {},
  flareContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  flare: {
    width: UIElements.successModal.flare.width,
    height: UIElements.successModal.flare.height,
  },
  sparkle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: Colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    zIndex: 2,
  },
});

