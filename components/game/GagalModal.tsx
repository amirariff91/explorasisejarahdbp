import { useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { ASSETS } from '@/constants/assets';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Typography, getResponsiveFontSize, getTextShadowStyle, Shadows, getComponentShadowStyle } from '@/constants/theme';
import { ButtonSizes, TouchTargets, Spacing, getResponsiveSizeScaled } from '@/constants/layout';
import * as Haptics from 'expo-haptics';

interface GagalModalProps {
  visible: boolean;
  message?: string;
  onRetry: () => void;
  onBackToMap: () => void;
  allowFontScaling?: boolean;
}

const BUTTON_ASSET = ASSETS.games.dbpSejarah.buttonTeruskan.default;

export default function GagalModal({
  visible,
  message = 'Anda telah menjawab 3 soalan dengan salah',
  onRetry,
  onBackToMap,
  allowFontScaling = false,
}: GagalModalProps) {
  const { width } = useWindowDimensions();

  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(40);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Trigger error haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Content fade & slide with shake effect
      contentOpacity.value = withTiming(1, { duration: 400 });
      contentTranslateY.value = withSpring(0, { damping: 14, stiffness: 150 });

      // Subtle shake animation
      shakeX.value = withSpring(0, {
        damping: 2,
        stiffness: 300,
        mass: 0.5,
      });
    } else {
      contentOpacity.value = 0;
      contentTranslateY.value = 40;
      shakeX.value = 0;
    }
  }, [visible, contentOpacity, contentTranslateY, shakeX]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateY: contentTranslateY.value },
      { translateX: shakeX.value },
    ],
  }));

  // Use responsive scaling for modal elements (4-tier system)
  const buttonDimensions = {
    width: getResponsiveSizeScaled(ButtonSizes.successAction.portrait.width, width),
    height: getResponsiveSizeScaled(ButtonSizes.successAction.portrait.height, width),
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <Animated.View style={[styles.panelWrapper, { paddingTop: getResponsiveSizeScaled(60, width) }, contentAnimatedStyle]}>
        <View style={[styles.panelBackground, { padding: getResponsiveSizeScaled(32, width) }]}>
          <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { fontSize: getResponsiveFontSize('stateLabel', width) },
            ]}
            allowFontScaling={allowFontScaling}
          >
            GAGAL
          </Text>

          <Text
            style={[styles.messageText, { fontSize: getResponsiveFontSize('answer', width) }]}
            allowFontScaling={allowFontScaling}
          >
            {message}
          </Text>

          <View style={styles.buttons}>
            <Pressable
              style={[styles.button, styles.primaryButton, buttonDimensions]}
              onPress={onRetry}
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
                CUBA LAGI
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton, buttonDimensions]}
              onPress={onBackToMap}
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
                KEMBALI KE PETA
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
    backgroundColor: 'rgba(80, 30, 30, 0.85)', // Darker red-tinted overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  panelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xxxl * 1.5,
    paddingHorizontal: Spacing.xxxl,
  },
  panelBackground: {
    backgroundColor: 'rgba(60, 20, 20, 0.95)',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#8B3030',
    ...getComponentShadowStyle(Shadows.component.large),
  },
  content: {
    alignItems: 'center',
    gap: Spacing.lg,
    zIndex: 2,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal,
    color: '#FF6B6B', // Red color for GAGAL
    letterSpacing: 1.5,
    ...getTextShadowStyle(Shadows.text.medium),
  },
  messageText: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 24,
    opacity: 0.9,
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
