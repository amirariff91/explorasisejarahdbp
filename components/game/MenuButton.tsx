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
import { useRouter, usePathname } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';
import { playSound, playMenuSound } from '@/utils/audio';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getComponentShadowStyle,
  Shadows,
  BorderRadius,
} from '@/constants/theme';
import { ButtonSizes, TouchTargets, getResponsiveSizeScaled } from '@/constants/layout';
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
  const pathname = usePathname();
  const { clearStateAnswers, gameState, setAllowFontScaling } = useGameContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  // Use responsive button sizing (4-tier system)
  const baseSize = {
    width: getResponsiveSizeScaled(ButtonSizes.menu.phone.width, width),
    height: getResponsiveSizeScaled(ButtonSizes.menu.phone.height, width),
  };
  const sizeModifier = size === 'small' ? 0.7 : 1;
  const menuButtonSize = {
    width: baseSize.width * sizeModifier,
    height: baseSize.height * sizeModifier,
  };

  const handleOpenMenu = () => {
    playMenuSound(); // Slide-in effect for menu opening
    setShowMenu(true);
  };

  const handleResume = () => {
    playSound('click', { volume: 0.8 }); // Soft close sound
    setShowMenu(false);
  };

  const handleRestart = () => {
    playSound('star'); // Celebratory sound for fresh start
    setShowMenu(false);

    // Extract state from pathname (e.g., "/quiz/johor" -> "johor")
    const pathParts = pathname.split('/');
    const state = pathParts[pathParts.length - 1];

    // Clear all answers for the current state
    if (state && state !== '' && state !== 'quiz' && state !== 'crossword') {
      clearStateAnswers(state as any); // Clear answers to restart
      const restartHref = `${pathname}?restart=${Date.now()}`;
      router.replace(restartHref as any); // Force remount by changing href
    }
  };

  const handleQuit = () => {
    playMenuSound(); // Exit transition
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
        style={({ pressed }) => [
          styles.menuButton,
          {
            width: menuButtonSize.width,
            height: menuButtonSize.height,
            bottom: insets.bottom + 20, // Add safe area padding to prevent home indicator overlap
            left: Math.max(insets.left, 12), // Ensure spacing from left edge, even with notches
            transform: [{ scale: pressed ? 0.92 : 1 }],
          },
        ]}
        onPress={handleOpenMenu}
        hitSlop={TouchTargets.hitSlop}>
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
                width: width < 1000 ? '80%' : '50%', // Width as percentage is fine
                paddingVertical: getResponsiveSizeScaled(30, width),
              },
            ]}>
            <Text
              style={[
                styles.menuTitle,
                { fontSize: getResponsiveFontSize('question', width) },
              ]}
              allowFontScaling={gameState.allowFontScaling}>
              MENU
            </Text>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { transform: [{ scale: 0.96 }] }
            ]}
            onPress={handleResume}
            hitSlop={TouchTargets.hitSlop}>
            <Text
              style={[styles.menuItemText, { fontSize: getResponsiveFontSize('answer', width) }]}
              allowFontScaling={gameState.allowFontScaling}
            >
              Teruskan
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { transform: [{ scale: 0.96 }] }
            ]}
            onPress={handleRestart}
            hitSlop={TouchTargets.hitSlop}>
            <Text
              style={[styles.menuItemText, { fontSize: getResponsiveFontSize('answer', width) }]}
              allowFontScaling={gameState.allowFontScaling}
            >
              Ulang Semula
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { transform: [{ scale: 0.96 }] }
            ]}
            onPress={handleQuit}
            hitSlop={TouchTargets.hitSlop}>
            <Text
              style={[styles.menuItemText, { fontSize: getResponsiveFontSize('answer', width) }]}
              allowFontScaling={gameState.allowFontScaling}
            >
              Keluar ke Peta
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.menuItemSecondary,
              pressed && { transform: [{ scale: 0.96 }] }
            ]}
            onPress={toggleTextScaling}
            hitSlop={TouchTargets.hitSlop}>
            <Text
              style={[styles.menuItemSecondaryText, { fontSize: getResponsiveFontSize('answer', width) }]}
              allowFontScaling={gameState.allowFontScaling}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
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
    // Dynamic: fontSize
    fontFamily: Typography.fontFamily,
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
    // Dynamic: fontSize
    fontFamily: Typography.fontFamily,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
});
