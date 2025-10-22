import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useGameContext } from '@/contexts/GameContext';
import {
  Colors,
  Typography,
  getResponsiveFontSize,
  getComponentShadowStyle,
  Shadows,
  BorderRadius,
} from '@/constants/theme';
import { isLandscapeMode, ButtonSizes } from '@/constants/layout';

/**
 * MenuButton Component - Bottom-left pause button
 * Opens overlay with: Resume, Restart, Quit, Settings
 * Figma: MENU-BUTTON 1
 */
export default function MenuButton() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { resetGame, gameState, setAllowFontScaling } = useGameContext();
  const { width } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);
  const menuButtonSize = isLandscape ? ButtonSizes.menu.landscape : ButtonSizes.menu.portrait;

  const handleResume = () => {
    setShowMenu(false);
  };

  const handleRestart = () => {
    setShowMenu(false);
    // TODO: Restart current level
  };

  const handleQuit = () => {
    setShowMenu(false);
    router.back();
  };

  const toggleTextScaling = () => {
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
          },
        ]}
        onPress={() => setShowMenu(true)}>
        <Image
          source={require('@/assets/images/game/buttons/menu-button.png')}
          style={styles.menuButtonImage}
          contentFit="contain"
        />
      </Pressable>

      {/* Menu Modal */}
      <Modal visible={showMenu} transparent animationType="fade">
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
    </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    bottom: 20,
    left: 12,
    zIndex: 10,
  },
  menuButtonImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.backgroundOverlay,
    justifyContent: 'center',
    alignItems: 'center',
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
