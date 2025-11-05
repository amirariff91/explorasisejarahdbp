import { statePaths } from "@/constants/mapPaths";
import { StateVisuals } from "@/constants/theme";
import { useGameContext } from "@/contexts/GameContext";
import type { MalaysianState } from "@/types";
import { playSound } from "@/utils/audio";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";

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
  const isLandscape = width >= 800;
  const [pressedState, setPressedState] = useState<MalaysianState | null>(null);

  // Calculate responsive map dimensions based on available space
  // Restored to original size for better visibility within board
  const { mapWidth, mapHeight } = useMemo(() => {
    const DESIRED_WIDTH_RATIO = isLandscape ? 0.85 : 0.88;
    const MIN_WIDTH_RATIO = isLandscape ? 0.65 : 0.72;
    const MAX_HEIGHT_RATIO = isLandscape ? 0.85 : 0.72;

    const desiredWidth = width * DESIRED_WIDTH_RATIO;
    const minWidth = width * MIN_WIDTH_RATIO;
    const maxMapHeight = height * MAX_HEIGHT_RATIO;

    let mapHeight = Math.min(desiredWidth * 0.667, maxMapHeight);
    let mapWidth = mapHeight / 0.667;

    if (mapWidth < minWidth) {
      mapWidth = minWidth;
      mapHeight = Math.min(mapWidth * 0.667, maxMapHeight);
    }

    return { mapWidth, mapHeight };
  }, [width, height, isLandscape]);

  const mapVerticalOffset = useMemo(
    () => -Math.max(mapHeight * 0.15, 20),
    [mapHeight],
  );

  const borneoOffsetX = useMemo(() => -220, []); // Pull East Malaysia closer to peninsula horizontally
  const borneoOffsetY = useMemo(() => -40, []); // Move East Malaysia upward within board boundaries

  const handleStatePressIn = (state: MalaysianState) => {
    playSound("click", { volume: 0.3 }); // Very subtle preview sound on touch
    setPressedState(state);
  };

  const handleStatePressOut = () => {
    setPressedState(null);
  };

  const handleStatePress = async (state: MalaysianState) => {
    playSound("click"); // Full volume click on final selection
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStateSelect(state);
  };

  const getStateColor = (state: MalaysianState): string => {
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
        onPressIn={() => handleStatePressIn(state)}
        onPressOut={handleStatePressOut}
        onPress={() => handleStatePress(state)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Malaysia Map - Centered */}
      <View style={[styles.mapWrapper, { marginTop: mapVerticalOffset }]}>
        <Svg
          width={mapWidth}
          height={mapHeight}
          viewBox="-200 -150 1650 1100"
        >
          {/* Peninsular Malaysia - Scaled up to fill more canvas */}
          <G origin="250, 400" scale="1.55">
            {peninsulaStates.map((state) =>
              renderStatePath(state, statePaths[state]),
            )}
          </G>

          {/* East Malaysia (Borneo) - Shifted and enlarged */}
          <G transform={`translate(${borneoOffsetX} ${borneoOffsetY})`} scale="1.35">
            {borneoStates.map((state) =>
              renderStatePath(state, statePaths[state]),
            )}
          </G>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Map SVG Wrapper with flex layout
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    alignSelf: "stretch",
  },
  mapWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
