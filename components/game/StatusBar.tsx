import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameContext } from '@/contexts/GameContext';
import type { MalaysianState } from '@/types';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getTextShadowStyle,
  Shadows,
} from '@/constants/theme';
import { isLandscapeMode, getEdgeMargin, getDeviceSize, UIElements, Spacing } from '@/constants/layout';
import { ASSETS } from '@/constants/assets';

interface StatusBarProps {
  state: MalaysianState;
}

/**
 * StatusBar Component - Top game HUD (Landscape Optimized)
 * Shows: Current State (top-left)
 * Figma: BG-NATION 1
 * Optimized for landscape orientation with horizontal layout and dead zones
 */
export default function StatusBar({ state }: StatusBarProps) {
  const { gameState } = useGameContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = isLandscapeMode(width);
  const isPhone = getDeviceSize(width) === 'phone';
  const isJohor = state === 'johor';
  const edgeMargin = getEdgeMargin(isLandscape);
  const statusBarSizes = UIElements.statusBar;
  const allowScaling = gameState.allowFontScaling;
  const topOffset = insets.top;

  const stateDisplayNames: Record<MalaysianState, string> = {
    perlis: 'Perlis',
    kedah: 'Kedah',
    'pulau-pinang': 'Pulau Pinang',
    perak: 'Perak',
    selangor: 'Selangor',
    'kuala-lumpur': 'Kuala Lumpur',
    'negeri-sembilan': 'Negeri Sembilan',
    melaka: 'Melaka',
    johor: 'Johor',
    pahang: 'Pahang',
    terengganu: 'Terengganu',
    kelantan: 'Kelantan',
    sabah: 'Sabah',
    sarawak: 'Sarawak',
  };

  const baseStateIndicatorSize = isLandscape
    ? statusBarSizes.stateIndicator.landscape
    : statusBarSizes.stateIndicator.portrait;
  const stateIndicatorScale = 1.1;

  // All states except Johor: 20% larger badge on tablets only
  const badgeEnhancement = !isJohor && !isPhone ? 1.2 : 1.0;

  const scaledStateIndicator = {
    width: baseStateIndicatorSize.width * stateIndicatorScale * badgeEnhancement,
    height: baseStateIndicatorSize.height * stateIndicatorScale * badgeEnhancement,
  };

  const containerDynamicStyle: ViewStyle = isPhone
    ? {
        position: 'absolute',
        top: topOffset,
        left: edgeMargin,
        paddingTop: 0,
        zIndex: 25,
      }
    : {
        paddingTop: topOffset,
      };

  return (
    <View style={[styles.container, { paddingHorizontal: edgeMargin }, containerDynamicStyle]}>
      {/* State Name - Left */}
      <View style={styles.stateContainer}>
        <Image
          source={ASSETS.shared.ui.bgNation}
          style={[
            styles.stateImage,
            {
              width: scaledStateIndicator.width,
              height: scaledStateIndicator.height,
            },
          ]}
          contentFit="contain"
        />
        <Text
          style={[
            styles.stateName,
            {
              fontSize: getResponsiveFontSize('stateLabel', width), // Responsive: 24→38px across 4 tiers
            },
          ]}
          allowFontScaling={allowScaling}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.65}
          ellipsizeMode="tail">
          {stateDisplayNames[state]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // paddingTop set dynamically with safe area insets
    paddingBottom: Spacing.sm,
    // paddingHorizontal set dynamically for dead zones
  },
  stateContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateImage: {
    height: 70, // Default, overridden by dynamic height
  },
  stateName: {
    position: 'absolute',
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.normal,
    color: Colors.textLight,
    textAlign: 'center',
    width: '80%', // Prevent text from hitting curved edges
    top: '22%', // Visually center text within the wood badge (optical adjustment)
    ...getTextShadowStyle(Shadows.text.subtle),
  },
});
