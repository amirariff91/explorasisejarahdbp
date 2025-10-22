import { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { SuccessModalProps } from '@/types';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getTextShadowStyle,
  Shadows,
} from '@/constants/theme';
import { isLandscapeMode, UIElements, ButtonSizes, TouchTargets } from '@/constants/layout';
import { useGameContext } from '@/contexts/GameContext';

/**
 * SuccessModal Component - Figma Screen 7
 * Celebration overlay when player completes a state
 * Shows: Flare, Star, TAHNIAH-BG, TERUSKAN, ULANG SEMULA buttons
 */
export default function SuccessModal({ visible, onContinue, onRestart }: SuccessModalProps) {
  const { gameState } = useGameContext();
  const allowScaling = gameState.allowFontScaling;
  const { width } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const successElements = UIElements.successModal;
  const buttonSize = isLandscape
    ? ButtonSizes.successAction.landscape
    : ButtonSizes.successAction.portrait;

  // Animation values
  const starRotation = useSharedValue(0);
  const starScale = useSharedValue(0);
  const flareScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  // Trigger animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Star rotation (continuous)
      starRotation.value = withRepeat(withTiming(360, { duration: 3000 }), -1, false);

      // Star scale (bounce in)
      starScale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );

      // Flare scale (grow)
      flareScale.value = withTiming(1, { duration: 800 });

      // Content fade in + slide up
      contentOpacity.value = withTiming(1, { duration: 600 });
      contentTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    } else {
      // Reset animations
      starRotation.value = 0;
      starScale.value = 0;
      flareScale.value = 0;
      contentOpacity.value = 0;
      contentTranslateY.value = 50;
    }
  }, [visible]);

  // Animated styles
  const starAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${starRotation.value}deg` }, { scale: starScale.value }],
  }));

  const flareAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flareScale.value }],
    opacity: flareScale.value * 0.7,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Flare Background Effect - Animated */}
        <Animated.View style={[styles.flareContainer, flareAnimatedStyle]}>
          <Image
            source={require('@/assets/images/game/ui-elements/flare.png')}
            style={styles.flare}
            contentFit="contain"
          />
        </Animated.View>

        {/* Star - Animated */}
        <Animated.View style={starAnimatedStyle}>
          <Image
            source={require('@/assets/images/game/ui-elements/star.png')}
            style={[
              styles.star,
              {
                width: isLandscape
                  ? successElements.star.landscape.width
                  : successElements.star.portrait.width,
                height: isLandscape
                  ? successElements.star.landscape.height
                  : successElements.star.portrait.height,
              },
            ]}
            contentFit="contain"
          />
        </Animated.View>

        {/* Tahniah Board */}
        <Image
          source={require('@/assets/images/game/ui-elements/tahniah-bg.png')}
          style={[
            styles.tahniahBg,
            {
              width: isLandscape
                ? successElements.tahniahBg.landscape.width
                : successElements.tahniahBg.portrait.width,
              height: isLandscape
                ? successElements.tahniahBg.landscape.height
                : successElements.tahniahBg.portrait.height,
            },
          ]}
          contentFit="contain"
        />

        {/* Content Container - Animated */}
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <Text
            style={[
              styles.title,
              { fontSize: getResponsiveFontSize(Typography.title, isLandscape) + 4 },
            ]}
            allowFontScaling={allowScaling}>
            TAHNIAH! 🎉
          </Text>

          <Text
            style={[
              styles.subtitle,
              { fontSize: getResponsiveFontSize(Typography.subtitle, isLandscape) },
            ]}
            allowFontScaling={allowScaling}>
            Anda telah berjaya menamatkan negeri ini!
          </Text>

          {/* Teruskan Button */}
          <Pressable
            style={[
              styles.button,
              {
                width: buttonSize.width,
                height: buttonSize.height,
              },
            ]}
            onPress={onContinue}
            hitSlop={TouchTargets.hitSlop}>
            <Image
              source={require('@/assets/images/game/ui-elements/button-teruskan.png')}
              style={styles.buttonImage}
              contentFit="contain"
            />
            <Text
              style={[
                styles.buttonText,
                { fontSize: getResponsiveFontSize(Typography.button, isLandscape) },
              ]}
              allowFontScaling={allowScaling}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
              ellipsizeMode="tail">
              TERUSKAN
            </Text>
          </Pressable>

          {/* Ulang Semula Button */}
          <Pressable
            style={[
              styles.button,
              {
                width: buttonSize.width,
                height: buttonSize.height,
              },
            ]}
            onPress={onRestart}
            hitSlop={TouchTargets.hitSlop}>
            <Image
              source={require('@/assets/images/game/ui-elements/button-teruskan.png')}
              style={styles.buttonImage}
              contentFit="contain"
            />
            <Text
              style={[
                styles.buttonText,
                { fontSize: getResponsiveFontSize(Typography.button, isLandscape) },
              ]}
              allowFontScaling={allowScaling}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.7}
              ellipsizeMode="tail">
              ULANG SEMULA
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.backgroundOverlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flareContainer: {
    position: 'absolute',
  },
  flare: {
    width: UIElements.successModal.flare.width,
    height: UIElements.successModal.flare.height,
  },
  star: {
    position: 'absolute',
    top: 80,
  },
  tahniahBg: {
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    ...getTextShadowStyle(Shadows.text.strong),
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 40,
  },
  button: {
    position: 'relative',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
    maxWidth: '90%',
    textAlign: 'center',
  },
});
