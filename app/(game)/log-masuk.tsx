import { useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameTextInput } from '@/components/game/GameTextInput';
import { useGameContext } from '@/contexts/GameContext';
import { playSound } from '@/utils/audio';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { ASSETS } from '@/constants/assets';
import { getResponsiveSizeScaled } from '@/constants/layout';

/**
 * Log Masuk Screen
 * Collects player name and age before entering the game
 */
export default function LogMasukScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { setPlayerProfile } = useGameContext();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  // Responsive sizing using 4-tier system
  const panelWidth = getResponsiveSizeScaled(320, width);
  const panelPadding = getResponsiveSizeScaled(20, width, 1.5); // Cap at 1.5× for panels
  const inputGap = getResponsiveSizeScaled(12, width);
  const buttonWidth = getResponsiveSizeScaled(100, width);
  const buttonHeight = buttonWidth * 0.77;
  const safeAreaPadding = getResponsiveSizeScaled(20, width);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; age?: string } = {};

    // Validate name
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Nama diperlukan';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Nama terlalu pendek (min 2 aksara)';
    } else if (trimmedName.length > 30) {
      newErrors.name = 'Nama terlalu panjang (max 30 aksara)';
    }

    // Validate age
    const ageNum = parseInt(age, 10);
    if (!age) {
      newErrors.age = 'Umur diperlukan';
    } else if (isNaN(ageNum)) {
      newErrors.age = 'Umur mesti nombor';
    } else if (ageNum < 6) {
      newErrors.age = 'Umur minimum adalah 6 tahun';
    } else if (ageNum > 12) {
      newErrors.age = 'Umur maksimum adalah 12 tahun';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      // Play error sound for validation failure
      playSound('click', { volume: 0.7 }); // Softer click for error
      return;
    }

    // Save profile and navigate - play success sound
    playSound('star'); // Celebratory sound for successful profile creation
    const trimmedName = name.trim();
    const ageNum = parseInt(age, 10);
    setPlayerProfile(trimmedName, ageNum);

    // Navigate to map
    setTimeout(() => {
      router.replace('/map');
    }, 300);
  };

  const isFormValid = () => {
    const trimmedName = name.trim();
    const ageNum = parseInt(age, 10);
    return (
      trimmedName.length >= 2 &&
      trimmedName.length <= 30 &&
      !isNaN(ageNum) &&
      ageNum >= 6 &&
      ageNum <= 12
    );
  };

  return (
    <ImageBackground
      source={ASSETS.shared.backgrounds.main}
      style={styles.container}
      resizeMode="cover">
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + safeAreaPadding,
            paddingBottom: insets.bottom + safeAreaPadding,
          },
        ]}>
        {/* Blue Panel Container */}
        <View
          style={[
            styles.panel,
            {
              width: panelWidth,
              padding: panelPadding,
            },
          ]}>
          {/* Input Fields Container */}
          <View style={[styles.inputsContainer, { gap: inputGap }]}>
            <GameTextInput
              label="NAMA"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
              placeholder="Masukkan nama anda"
              maxLength={30}
              error={errors.name}
              accessibilityLabel="Nama pengguna"
              width={width}
            />

            <GameTextInput
              label="UMUR"
              value={age}
              onChangeText={(text) => {
                setAge(text);
                if (errors.age) {
                  setErrors((prev) => ({ ...prev, age: undefined }));
                }
              }}
              placeholder="6-12"
              keyboardType="number-pad"
              maxLength={2}
              error={errors.age}
              accessibilityLabel="Umur pengguna"
              width={width}
            />
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, !isFormValid() && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid()}
              accessibilityRole="button"
              accessibilityLabel="Mula bermain"
              accessibilityState={{ disabled: !isFormValid() }}>
              <Image
                source={ASSETS.shared.buttons.next.default}
                style={[
                  styles.buttonImage,
                  { width: buttonWidth, height: buttonHeight },
                ]}
                contentFit="contain"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Panel
  panel: {
    backgroundColor: Colors.loginPanel,
    borderRadius: BorderRadius.large,
    ...Shadows.component.medium,
    // Add subtle border for depth
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
  },

  // Inputs Container
  inputsContainer: {
    width: '100%',
  },

  // Button Container
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonImage: {
    width: 120,
    height: 92,
  },

  buttonDisabled: {
    opacity: 0.5,
  },
});
