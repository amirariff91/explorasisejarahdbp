import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';
import { playSound } from '@/utils/audio';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getComponentShadowStyle,
  Shadows,
  BorderRadius,
} from '@/constants/theme';
import { isLandscapeMode, ButtonSizes } from '@/constants/layout';
import { ASSETS } from '@/constants/assets';

/**
 * MenuButton Component - Bottom-left pause button
 * Opens overlay with: Resume, Restart, Quit, Settings
 * Figma: MENU-BUTTON 1
 */
interface MenuButtonProps {
  size?: 'default' | 'small';
}

export default function MenuButton({ size = 'default' }: MenuButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { resetGame, gameState, setAllowFontScaling } = useGameContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLandscape = isLandscapeMode(width);
  const baseSize = isLandscape ? ButtonSizes.menu.landscape : ButtonSizes.menu.portrait;
  const sizeModifier = size === 'small' ? 0.7 : 1;
  const menuButtonSize = {
    width: baseSize.width * sizeModifier,
    height: baseSize.height * sizeModifier,
  };

  const handleOpenMenu = () => {
    playSound('click');
    setShowMenu(true);
  };

  const handleResume = () => {
    playSound('click');
    setShowMenu(false);
  };

  const handleRestart = () => {
    playSound('click');
    setShowMenu(false);
    // TODO: Restart current level
  };

  const handleQuit = () => {
    playSound('click');
    setShowMenu(false);
    router.back();
  };

  const toggleTextScaling = () => {
    playSound('click');
    setAllowFontScaling(!gameState.allowFontScaling);
  };

  return (
    <>
      {/* Menu Button */}
      <Pressable
        style={[
          styles.menuButton,
          {
            width: menuButtonSize.width,
            height: menuButtonSize.height,
            bottom: insets.bottom + 20, // Add safe area padding to prevent home indicator overlap
            left: Math.max(insets.left, 12), // Ensure spacing from left edge, even with notches
          },
        ]}
        onPress={handleOpenMenu}>
        <Image
          source={ASSETS.shared.buttons.menu.default}
          style={styles.menuButtonImage}
          contentFit="contain"
        />
      </Pressable>

      {/* Menu Overlay - Only render when visible */}
      {showMenu && (
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.menuContainer,
              {
                width: isLandscape ? '50%' : '80%',
                paddingVertical: isLandscape ? 40 : 30,
              },
            ]}>
            <Text
              style={[
                styles.menuTitle,
                { fontSize: getResponsiveFontSize(Typography.title, isLandscape) },
              ]}
              allowFontScaling={gameState.allowFontScaling}>
              MENU
            </Text>

          <Pressable style={styles.menuItem} onPress={handleResume}>
            <Text style={styles.menuItemText} allowFontScaling={gameState.allowFontScaling}>Teruskan</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleRestart}>
            <Text style={styles.menuItemText} allowFontScaling={gameState.allowFontScaling}>Ulang Semula</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={handleQuit}>
            <Text style={styles.menuItemText} allowFontScaling={gameState.allowFontScaling}>Keluar ke Peta</Text>
          </Pressable>

          <Pressable style={styles.menuItemSecondary} onPress={toggleTextScaling}>
            <Text style={styles.menuItemSecondaryText} allowFontScaling={gameState.allowFontScaling}>
              Aksesibiliti: Teks Besar {gameState.allowFontScaling ? 'Hidup' : 'Mati'}
            </Text>
          </Pressable>
        </View>
      </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    // bottom and left set dynamically with safe area insets
    zIndex: 10,
  },
  menuButtonImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.backgroundOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998, // Just below SuccessModal but above everything else
  },
  menuContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.large,
    padding: 30,
    alignItems: 'center',
    ...getComponentShadowStyle(Shadows.component.large),
  },
  menuTitle: {
    fontFamily: Typography.fontFamily,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  menuItem: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.small,
    marginVertical: 8,
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
  },
  menuItemSecondary: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.small,
    marginTop: 16,
    alignItems: 'center',
  },
  menuItemSecondaryText: {
    fontFamily: Typography.fontFamily,
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
});
