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
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Colors, Typography, getResponsiveFontSize, getTextShadowStyle, Shadows, getComponentShadowStyle } from '@/constants/theme';
import { ButtonSizes, TouchTargets, UIElements, isLandscapeMode, Spacing } from '@/constants/layout';
import type { CongratsOverlayProps } from '@/types';

function useSparkleAnimation(visible: boolean, delay: number) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      // Refined sparkle timing: faster, subtler pulsing
      opacity.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 500 }), // Slightly faster fade in
            withTiming(0.4, { duration: 600 }) // Higher minimum opacity
          ),
          -1,
          true
        )
      );

      scale.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1.08, { duration: 500 }), // Less extreme scaling
            withTiming(0.95, { duration: 600 }) // Subtle pulse
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

const STAR_ASSET = ASSETS.shared.ui.star;
const PANEL_ASSET = ASSETS.games.dbpSejarah.tahniahBg;
const BUTTON_ASSET = ASSETS.games.dbpSejarah.buttonTeruskan.default;
const FLARE_ASSET = ASSETS.shared.ui.flare;

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
      // Star entrance: Quick bounce with refined timing
      starScale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 150 }), // Slightly more bounce
        withSpring(1, { damping: 12, stiffness: 180 }) // Smoother settle
      );

      // Content fade & slide: Smooth entrance
      contentOpacity.value = withTiming(1, { duration: 400 }); // Slightly faster
      contentTranslateY.value = withSpring(0, { damping: 14, stiffness: 150 }); // Tighter spring
      
      // Flare: Delayed entrance for depth
      flareScale.value = withDelay(100, withTiming(1, { duration: 600 })); // Subtle delay
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
      isLandscape
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
          ],
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
      <Animated.View style={[styles.flareContainer, flareAnimatedStyle]} pointerEvents="none">
        <Image source={FLARE_ASSET} style={styles.flare} contentFit="contain" />
      </Animated.View>

      {sparkleSpots.map((spot, index) => {
        const { size, ...position } = spot;
        return (
          <View
            key={`sparkle-${index}`}
            style={[
              styles.sparkle,
              position as any,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
            pointerEvents="none"
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: Colors.textLight, opacity: 0.85 },
                sparkleStyles[index],
              ]}
            />
          </View>
        );
      })}

      <Animated.View style={[styles.panelWrapper, { paddingTop: isLandscape ? 80 : 100 }, contentAnimatedStyle]}>
        <Image
          source={PANEL_ASSET}
          style={[
            styles.panelImage,
            { width: panelDimensions.width, height: panelDimensions.height },
          ]}
          contentFit="contain"
          pointerEvents="none"
        />

        <Animated.View style={[styles.starGroup, starGroupAnimatedStyle]} pointerEvents="none">
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
                marginHorizontal: Spacing.md,
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
    backgroundColor: Colors.backgroundOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  panelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop set dynamically in JSX (80 landscape / 100 portrait)
    paddingBottom: Spacing.xxxl * 1.5, // 48px
    paddingHorizontal: Spacing.xxxl,
  },
  panelImage: {
    position: 'absolute',
    ...getComponentShadowStyle(Shadows.component.large),
  },
  content: {
    alignItems: 'center',
    gap: Spacing.lg,
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
    gap: Spacing.lg,
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
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    ...getTextShadowStyle(Shadows.text.medium),
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: Colors.textLight,
    opacity: 0.95,
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
    shadowColor: Colors.gold,
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    zIndex: 2,
  },
});
