import React, { useMemo, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useGameContext } from '@/contexts/GameContext';
import { playSound } from '@/utils/audio';
import type { MalaysianState } from '@/types';
import { StateVisuals } from '@/constants/theme';
import { stateDisplayNames } from '@/constants/mapLayout';
import { statePaths } from '@/constants/mapPaths';

interface MalaysiaMapSVGProps {
  onStateSelect: (state: MalaysianState) => void;
}

/**
 * Interactive SVG Malaysia Map Component
 * Based on standard Malaysian political map geography
 * Similar to mypeta.ai layout
 */
export default function MalaysiaMapSVG({ onStateSelect }: MalaysiaMapSVGProps) {
  const { width } = useWindowDimensions();
  const { gameState } = useGameContext();
  const isLandscape = width >= 800;
  const [pressedState, setPressedState] = useState<MalaysianState | null>(null);
  const [selectedState, setSelectedState] = useState<MalaysianState | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // All Malaysian states for dropdown
  const allStates: MalaysianState[] = [
    'perlis', 'kedah', 'pulau-pinang', 'perak', 'selangor', 'kuala-lumpur',
    'negeri-sembilan', 'melaka', 'johor', 'pahang', 'kelantan', 'terengganu',
    'sabah', 'sarawak'
  ];

  // Calculate responsive map dimensions (15% smaller for better spacing)
  const mapWidth = useMemo(() => {
    return Math.min(width * 0.9, isLandscape ? 700 : 450) * 0.85;
  }, [width, isLandscape]);

  const mapHeight = useMemo(() => {
    return mapWidth * 0.667; // 3:2 aspect ratio (matches viewBox 1200x800)
  }, [mapWidth]);

  const handleStatePress = async (state: MalaysianState) => {
    playSound('click');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStateSelect(state);
  };

  const handleDropdownSelect = async (state: MalaysianState) => {
    playSound('click');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedState(state);
    setShowDropdown(false);
  };

  const handleDropdownOpen = () => {
    playSound('click');
    setShowDropdown(true);
  };

  const handleNextPress = async () => {
    if (!selectedState) return;
    playSound('click');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStateSelect(selectedState);
  };

  const getStateColor = (state: MalaysianState): string => {
    // Highlight selected state from dropdown
    if (selectedState === state) {
      return '#4A90E2'; // Blue highlight for selected
    }
    const isCompleted = gameState.completedStates.includes(state);
    if (isCompleted) {
      return '#4CAF50'; // Green for completed
    }
    // Use existing StateVisuals colors
    return StateVisuals[state]?.color || '#FFD700';
  };


  // Separate peninsula and Borneo states for different scaling
  const peninsulaStates: MalaysianState[] = [
    'perlis', 'kedah', 'pulau-pinang', 'perak', 'selangor', 'kuala-lumpur',
    'negeri-sembilan', 'melaka', 'johor', 'pahang', 'kelantan', 'terengganu'
  ];
  const borneoStates: MalaysianState[] = ['sabah', 'sarawak'];

  const renderStatePath = (state: MalaysianState, pathData: string) => {
    const isPressed = pressedState === state;
    return (
      <Path
        key={state}
        d={pathData}
        fill={getStateColor(state)}
        stroke={isPressed ? "#FFD700" : "#2c3e50"}
        strokeWidth={isPressed ? "4" : "2.5"}
        opacity={isPressed ? 0.95 : 0.85}
        onPressIn={() => setPressedState(state)}
        onPressOut={() => setPressedState(null)}
        onPress={() => handleStatePress(state)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Selector */}
      <Pressable style={styles.dropdown} onPress={handleDropdownOpen}>
        <Text style={styles.dropdownText}>
          {selectedState ? stateDisplayNames[selectedState] : 'Pilih Negeri'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </Pressable>

      {/* Malaysia Map */}
      <Svg width={mapWidth} height={mapHeight} viewBox="0 0 1200 800">
        {/* Peninsular Malaysia - Scaled 20% larger */}
        <G origin="250, 400" scale="1.2">
          {peninsulaStates.map((state) => renderStatePath(state, statePaths[state]))}
        </G>

        {/* East Malaysia (Borneo) - No scaling */}
        <G>
          {borneoStates.map((state) => renderStatePath(state, statePaths[state]))}
        </G>
      </Svg>

      {/* Next Button - Appears when state is selected from dropdown */}
      {selectedState && (
        <View style={styles.nextButtonContainer}>
          <Pressable
            style={styles.nextButton}
            onPress={handleNextPress}
            accessibilityRole="button"
            accessibilityLabel="Mula Kuiz">
            <Image
              source={require('@/assets/images/game/buttons/next-button.png')}
              style={styles.nextButtonImage}
              contentFit="contain"
            />
          </Pressable>
        </View>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setShowDropdown(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>Pilih Negeri</Text>
              <ScrollView
                style={styles.stateList}
                showsVerticalScrollIndicator={true}>
                {allStates.map((state) => (
                  <Pressable
                    key={state}
                    style={[
                      styles.stateItem,
                      selectedState === state && styles.stateItemSelected
                    ]}
                    onPress={() => handleDropdownSelect(state)}>
                    <Text style={[
                      styles.stateItemText,
                      selectedState === state && styles.stateItemTextSelected
                    ]}>
                      {stateDisplayNames[state]}
                    </Text>
                    {gameState.completedStates.includes(state) && (
                      <Text style={styles.completedBadge}>✓</Text>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingTop: 0,
    marginTop: -80,
    width: '100%',
  },
  // Dropdown Selector
  dropdown: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: [{ translateX: -119 }], // Half of maxWidth (238/2)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    width: '53.5%',
    maxWidth: 238,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#fff',
  },
  // Next Button
  nextButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 20,
  },
  nextButton: {
    width: 120,
    height: 90,
  },
  nextButtonImage: {
    width: '100%',
    height: '100%',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    maxHeight: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  stateList: {
    maxHeight: 180,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  stateItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  stateItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  stateItemTextSelected: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  completedBadge: {
    fontSize: 18,
    color: '#4CAF50',
  },
});
