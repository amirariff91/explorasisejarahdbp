import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GameTextInput } from '@/components/game/GameTextInput';
import { useGameContext } from '@/contexts/GameContext';
import { playSound } from '@/utils/audio';
import { Colors, BorderRadius, Shadows, Fonts } from '@/constants/theme';
import { ASSETS } from '@/constants/assets';

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

  // Landscape not used on this screen currently; keep width-based sizing

  // Responsive sizing
  const panelWidth = Math.min(width * 0.85, 420);
  const buttonWidth = Math.min(width * 0.22, 120);
  const buttonHeight = buttonWidth * 0.77;

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Blue Panel Container */}
          <View style={[styles.panel, { width: panelWidth }]}>
            {/* Title */}
            <Text style={styles.title}>LOG MASUK</Text>

            {/* Input Fields Container */}
            <View style={styles.inputsContainer}>
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
              />
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  styles.button,
                  !isFormValid() && styles.buttonDisabled,
                ]}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Panel
  panel: {
    backgroundColor: '#1E8EEA',
    borderRadius: BorderRadius.large,
    padding: 32,
    ...Shadows.component.medium,
    // Add subtle border for depth
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
  },

  // Title
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.gold,
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },

  // Inputs Container
  inputsContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 24,
  },

  // Button Container
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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
