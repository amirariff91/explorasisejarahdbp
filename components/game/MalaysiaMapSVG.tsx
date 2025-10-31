import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  Pressable,
  Modal,
  ScrollView,
  type LayoutChangeEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import Svg, { Path, G } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useGameContext } from "@/contexts/GameContext";
import { playSound } from "@/utils/audio";
import type { MalaysianState } from "@/types";
import { StateVisuals } from "@/constants/theme";
import { stateDisplayNames } from "@/constants/mapLayout";
import { statePaths } from "@/constants/mapPaths";

interface MalaysiaMapSVGProps {
  onStateSelect: (state: MalaysianState) => void;
}

/**
 * Interactive SVG Malaysia Map Component
 * Based on standard Malaysian political map geography
 * Similar to mypeta.ai layout
 */
export default function MalaysiaMapSVG({ onStateSelect }: MalaysiaMapSVGProps) {
  const { width, height } = useWindowDimensions();
  const { gameState } = useGameContext();
  const insets = useSafeAreaInsets();
  const isLandscape = width >= 800;
  const [pressedState, setPressedState] = useState<MalaysianState | null>(null);
  const [selectedState, setSelectedState] = useState<MalaysianState | null>(
    null,
  );
  const [showDropdown, setShowDropdown] = useState(false);

  // Measure element heights for accurate space calculation
  const [dropdownHeight, setDropdownHeight] = useState(54);
  const [buttonHeight, setButtonHeight] = useState(90);

  // Handle layout measurements
  const handleDropdownLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setDropdownHeight(height);
  }, []);

  const handleButtonLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setButtonHeight(height);
  }, []);

  // All Malaysian states for dropdown
  const allStates: MalaysianState[] = [
    "perlis",
    "kedah",
    "pulau-pinang",
    "perak",
    "selangor",
    "kuala-lumpur",
    "negeri-sembilan",
    "melaka",
    "johor",
    "pahang",
    "kelantan",
    "terengganu",
    "sabah",
    "sarawak",
  ];

  // Calculate responsive map dimensions based on available space
  const { mapWidth, mapHeight } = useMemo(() => {
    const SCALE_BOOST = 1.76; // enlarge overall map footprint ~76% vs original
    const DESIRED_WIDTH_RATIO = isLandscape ? 0.88 : 0.94;
    const MIN_WIDTH_RATIO = isLandscape ? 0.68 : 0.75;
    const MAX_HEIGHT_RATIO = isLandscape ? 1 : 0.92; // loosen cap so map can scale taller
    const MAP_ASPECT_RATIO = 0.667; // Height = width * aspect ratio (roughly 2:3)

    const desiredWidth = width * DESIRED_WIDTH_RATIO;
    const minWidth = width * MIN_WIDTH_RATIO;
    const maxMapHeight = height * MAX_HEIGHT_RATIO;

    let mapHeight = Math.min(desiredWidth * MAP_ASPECT_RATIO, maxMapHeight);
    let mapWidth = mapHeight / MAP_ASPECT_RATIO;

    if (mapWidth < minWidth) {
      mapWidth = minWidth;
      mapHeight = Math.min(mapWidth * MAP_ASPECT_RATIO, maxMapHeight);
    }

    mapHeight = Math.min(mapHeight * SCALE_BOOST, maxMapHeight);
    mapWidth = mapHeight / MAP_ASPECT_RATIO;

    return { mapWidth, mapHeight };
  }, [width, height, isLandscape]);

  const mapVerticalOffset = useMemo(
    () => -Math.max(mapHeight * 0.3, 30),
    [mapHeight],
  );

  const borneoOffsetX = useMemo(() => -170, []); // Shift Borneo left so scaled map fits the SVG viewBox

  const handleStatePress = async (state: MalaysianState) => {
    playSound("click");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStateSelect(state);
  };

  const handleDropdownSelect = async (state: MalaysianState) => {
    playSound("click");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedState(state);
    setShowDropdown(false);
  };

  const handleDropdownOpen = () => {
    playSound("click");
    setShowDropdown(true);
  };

  const handleNextPress = async () => {
    if (!selectedState) return;
    playSound("click");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStateSelect(selectedState);
  };

  const getStateColor = (state: MalaysianState): string => {
    // Highlight selected state from dropdown
    if (selectedState === state) {
      return "#4A90E2"; // Blue highlight for selected
    }
    const isCompleted = gameState.completedStates.includes(state);
    if (isCompleted) {
      return "#4CAF50"; // Green for completed
    }
    // Use existing StateVisuals colors
    return StateVisuals[state]?.color || "#FFD700";
  };

  // Separate peninsula and Borneo states for different scaling
  const peninsulaStates: MalaysianState[] = [
    "perlis",
    "kedah",
    "pulau-pinang",
    "perak",
    "selangor",
    "kuala-lumpur",
    "negeri-sembilan",
    "melaka",
    "johor",
    "pahang",
    "kelantan",
    "terengganu",
  ];
  const borneoStates: MalaysianState[] = ["sabah", "sarawak"];

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
      {/* Top Section: Dropdown + Map */}
      <View style={styles.topSection}>
        {/* Dropdown Selector */}
        <Pressable
          style={[styles.dropdown, { marginTop: insets.top }]}
          onPress={handleDropdownOpen}
          onLayout={handleDropdownLayout}
        >
          <Text style={styles.dropdownText}>
            {selectedState ? stateDisplayNames[selectedState] : "Pilih Negeri"}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </Pressable>

        {/* Malaysia Map */}
        <View style={[styles.mapWrapper, { marginTop: mapVerticalOffset }]}>
          <Svg
            width={mapWidth}
            height={mapHeight}
            viewBox="-220 -180 2000 1200"
          >
            {/* Peninsular Malaysia - Scaled up to fill more canvas */}
            <G origin="250, 400" scale="1.7">
              {peninsulaStates.map((state) =>
                renderStatePath(state, statePaths[state]),
              )}
            </G>

            {/* East Malaysia (Borneo) - Shifted and enlarged */}
            <G transform={`translate(${borneoOffsetX} 0)`} scale="1.485">
              {borneoStates.map((state) =>
                renderStatePath(state, statePaths[state]),
              )}
            </G>
          </Svg>
        </View>
      </View>

      {/* Spacer to force container to full height */}
      <View style={styles.spacer} />

      {/* Next Button - Always visible, disabled until state is selected */}
      <View
        style={[
          styles.nextButtonContainer,
          {
            bottom: insets.bottom + 10,
            right: insets.right + 10,
            opacity: selectedState ? 1 : 0.5,
          },
        ]}
        onLayout={handleButtonLayout}
      >
        <Pressable
          style={[
            styles.nextButton,
            {
              width: isLandscape ? 113 : 73,
              height: isLandscape ? 86 : 55,
            },
          ]}
          onPress={handleNextPress}
          disabled={!selectedState}
          accessibilityRole="button"
          accessibilityLabel="Mula Kuiz"
        >
          <Image
            source={require("@/assets/images/game/buttons/next-button.png")}
            style={styles.nextButtonImage}
            contentFit="contain"
          />
        </Pressable>
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>Pilih Negeri</Text>
              <ScrollView
                style={[
                  styles.stateList,
                  {
                    maxHeight: Math.min(
                      (height - insets.top - insets.bottom) * 0.5,
                      400,
                    ),
                  },
                ]}
                showsVerticalScrollIndicator={true}
              >
                {allStates.map((state) => (
                  <Pressable
                    key={state}
                    style={[
                      styles.stateItem,
                      selectedState === state && styles.stateItemSelected,
                    ]}
                    onPress={() => handleDropdownSelect(state)}
                  >
                    <Text
                      style={[
                        styles.stateItemText,
                        selectedState === state && styles.stateItemTextSelected,
                      ]}
                    >
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
  // Map SVG Wrapper with flex layout
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8.5,
    paddingBottom: 8.5,
    alignSelf: "stretch",
  },
  // Top Section: Groups dropdown + map together
  topSection: {
    alignItems: "center",
    gap: 8,
  },
  mapWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Spacer to force container height
  spacer: {
    flex: 1,
    minHeight: 1,
  },
  // Dropdown Container with safe area aware positioning
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2c3e50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: 160,
    alignSelf: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  dropdownArrow: {
    fontSize: 14,
    color: "#fff",
  },
  // Next Button Container with absolute positioning for better control
  nextButtonContainer: {
    position: "absolute",
    zIndex: 20,
  },
  nextButton: {
    width: 120,
    height: 90,
    left: "80%",
    top: "50%",
  },
  nextButtonImage: {
    width: "80%",
    height: "80%",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    width: "75%",
    maxWidth: 400,
    maxHeight: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    textAlign: "center",
  },
  stateList: {
    // maxHeight set dynamically in JSX based on screen height
  },
  stateItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  stateItemSelected: {
    backgroundColor: "#e3f2fd",
  },
  stateItemText: {
    fontSize: 14,
    color: "#2c3e50",
  },
  stateItemTextSelected: {
    fontWeight: "bold",
    color: "#4A90E2",
  },
  completedBadge: {
    fontSize: 16,
    color: "#4CAF50",
  },
});
