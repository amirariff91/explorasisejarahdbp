import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
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
import { isLandscapeMode, getEdgeMargin, UIElements } from '@/constants/layout';

interface StatusBarProps {
  state: MalaysianState;
}

/**
 * StatusBar Component - Top game HUD (Landscape Optimized)
 * Shows: Health bar (left), Money (right), Current State (center)
 * Figma: HEALTH 1, DUIT 1, BG-NATION 1
 * Optimized for landscape orientation with horizontal layout and dead zones
 */
export default function StatusBar({ state }: StatusBarProps) {
  const { gameState } = useGameContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = isLandscapeMode(width);
  const edgeMargin = getEdgeMargin(isLandscape);
  const statusBarSizes = UIElements.statusBar;
  const allowScaling = gameState.allowFontScaling;

  const stateDisplayNames: Record<MalaysianState, string> = {
    perlis: 'PERLIS',
    kedah: 'KEDAH',
    'pulau-pinang': 'P.PINANG',
    perak: 'PERAK',
    selangor: 'SELANGOR',
    'kuala-lumpur': 'KUALA LUMPUR',
    'negeri-sembilan': 'NEGERI SEMBILAN',
    melaka: 'MELAKA',
    johor: 'JOHOR',
    pahang: 'PAHANG',
    terengganu: 'TERENGGANU',
    kelantan: 'KELANTAN',
    sabah: 'SABAH',
    sarawak: 'SARAWAK',
  };

  const baseStateIndicatorSize = isLandscape
    ? statusBarSizes.stateIndicator.landscape
    : statusBarSizes.stateIndicator.portrait;
  const stateIndicatorScale = 1.3;
  const scaledStateIndicator = {
    width: baseStateIndicatorSize.width * stateIndicatorScale,
    height: baseStateIndicatorSize.height * stateIndicatorScale,
  };

  return (
    <View style={[styles.container, { paddingHorizontal: edgeMargin, paddingTop: insets.top + 8 }]}>
      {/* Health Bar - Left */}
      <View style={styles.statusItem}>
        <Image
          source={require('@/assets/images/game/ui-elements/health-bar.png')}
          style={[
            styles.barImage,
            {
              width: isLandscape
                ? statusBarSizes.healthBar.landscape.width
                : statusBarSizes.healthBar.portrait.width,
            },
          ]}
          contentFit="contain"
        />
        <Text
          style={[
            styles.statusText,
            { fontSize: getResponsiveFontSize(Typography.bodySmall, isLandscape) },
          ]}
          allowFontScaling={allowScaling}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
          ellipsizeMode="clip">
          ❤️ {gameState.health}%
        </Text>
      </View>

      {/* State Name - Center */}
      <View style={styles.stateContainer}>
        <Image
          source={require('@/assets/images/game/ui-elements/bg-nation.png')}
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
              fontSize: getResponsiveFontSize(Typography.heading, isLandscape),
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

      {/* Money Bar - Right */}
      <View style={styles.statusItem}>
        <Image
          source={require('@/assets/images/game/ui-elements/duit-bar.png')}
          style={[
            styles.barImage,
            {
              width: isLandscape
                ? statusBarSizes.moneyBar.landscape.width
                : statusBarSizes.moneyBar.portrait.width,
            },
          ]}
          contentFit="contain"
        />
        <Text
          style={[
            styles.statusText,
            { fontSize: getResponsiveFontSize(Typography.bodySmall, isLandscape) },
          ]}
          allowFontScaling={allowScaling}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.75}
          ellipsizeMode="clip">
          💰 RM{gameState.money}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingTop set dynamically with safe area insets
    paddingBottom: 8,
    // paddingHorizontal set dynamically for dead zones
  },
  statusItem: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barImage: {
    height: 50,
  },
  statusText: {
    position: 'absolute',
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    ...getTextShadowStyle(Shadows.text.medium),
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
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    textAlign: 'center',
    ...getTextShadowStyle(Shadows.text.subtle),
  },
});
