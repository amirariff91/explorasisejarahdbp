import { getDeviceSize } from "@/constants/layout";
import { statePaths } from "@/constants/mapPaths";
import { StateVisuals } from "@/constants/theme";
import { useGameContext } from "@/contexts/GameContext";
import type { MalaysianState } from "@/types";
import { playSound } from "@/utils/audio";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";

interface MalaysiaMapSVGProps {
  onStateSelect: (state: MalaysianState) => void;
  disabled?: boolean;
}

/**
 * Interactive SVG Malaysia Map Component
 * Based on standard Malaysian political map geography
 * Similar to mypeta.ai layout
 */
export default function MalaysiaMapSVG({ onStateSelect, disabled = false }: MalaysiaMapSVGProps) {
  const { width, height } = useWindowDimensions();
  const { gameState } = useGameContext();
  const [pressedState, setPressedState] = useState<MalaysianState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const isProcessingRef = useRef(false); // Synchronous processing lock to prevent race conditions
  const isMountedRef = useRef(true);

  // Track component mount status to prevent setState on unmounted component
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Calculate responsive map dimensions based on device tier
  // Tier-specific ratios ensure optimal fit within board container
  const { mapWidth, mapHeight } = useMemo(() => {
    const deviceSize = getDeviceSize(width);

    // Tier-specific ratios for optimal fit within board
    const sizeConfig = {
      'phone': { width: 0.92, minWidth: 0.78, height: 0.85 },
      'tablet-sm': { width: 0.88, minWidth: 0.72, height: 0.82 },
      'tablet-md': { width: 0.85, minWidth: 0.68, height: 0.80 },
      'tablet-lg': { width: 0.82, minWidth: 0.65, height: 0.78 },
    };

    const config = sizeConfig[deviceSize];
    const desiredWidth = width * config.width;
    const minWidth = width * config.minWidth;
    const maxMapHeight = height * config.height;

    let calculatedHeight = Math.min(desiredWidth * 0.667, maxMapHeight);
    let calculatedWidth = calculatedHeight / 0.667;

    if (calculatedWidth < minWidth) {
      calculatedWidth = minWidth;
      calculatedHeight = Math.min(calculatedWidth * 0.667, maxMapHeight);
    }

    return { mapWidth: calculatedWidth, mapHeight: calculatedHeight };
  }, [width, height]);

  const mapVerticalOffset = useMemo(() => {
    const deviceSize = getDeviceSize(width);
    const offsetConfig = {
      'phone': 0.15,
      'tablet-sm': 0.12,
      'tablet-md': 0.10,
      'tablet-lg': 0.08,
    };
    return -Math.max(mapHeight * offsetConfig[deviceSize], 15);
  }, [mapHeight, width]);

  // Responsive Borneo positioning - scales with map size for iPad and phone
  const borneoOffsetX = useMemo(() => -(mapWidth * 0.31), [mapWidth]); // ~31% of map width (was fixed -220)
  const borneoOffsetY = useMemo(() => -(mapHeight * 0.08), [mapHeight]); // ~8% of map height (was fixed -40)

  const handleStatePressIn = (state: MalaysianState) => {
    // Removed preview click sound to prevent double-click on state selection
    // Only play sound on final selection (handleStatePress)
    setPressedState(state);
  };

  const handleStatePressOut = () => {
    setPressedState(null);
  };

  const handleStatePress = async (state: MalaysianState) => {
    // TAP-TIME DEBUG: Log actual state at moment of tap (not render time)
    if (__DEV__) {
      console.log('[SVG] TAP RECEIVED at', Date.now(), 'for', state, {
        disabled,
        isProcessingRef: isProcessingRef.current,
        isDisabled: disabled || isProcessingRef.current,
      });
    }

    // GUARD: Prevent multiple simultaneous presses (using ref for synchronous check)
    if (disabled || isProcessingRef.current) {
      if (__DEV__) {
        console.log('[SVG] TAP BLOCKED -', { disabled, isProcessingRef: isProcessingRef.current, state });
      }
      return;
    }

    isProcessingRef.current = true; // Lock SYNCHRONOUSLY (no race condition)
    setIsProcessing(true); // Update state for visual feedback

    try {
      // Haptics only (sound plays in parent to avoid double-click and audio debouncing issues)
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch((error) => {
        if (__DEV__) {
          console.warn('[SVG] Haptics failed (non-blocking):', error);
        }
      });

      if (__DEV__) {
        console.log('[SVG] State selected:', state);
      }

      // Always call onStateSelect even if haptics fail
      onStateSelect(state);
    } catch (error) {
      console.error('[MalaysiaMapSVG] State press error:', error);
      // Still navigate even if there's an error
      onStateSelect(state);
    } finally {
      // Reset processing state after a short delay to prevent accidental double-taps
      setTimeout(() => {
        if (isMountedRef.current) {
          isProcessingRef.current = false; // Reset ref synchronously
          setIsProcessing(false); // Reset state for visual feedback
        }
      }, 200);
    }
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
    const isDisabled = disabled || isProcessingRef.current;

    return (
      <Path
        key={state}
        d={pathData}
        fill={getStateColor(state)}
        stroke={isPressed ? "#FFD700" : "#2c3e50"}
        strokeWidth={isPressed ? "2" : "1"}
        // Reduced opacity when disabled to provide visual feedback
        opacity={isDisabled ? 0.5 : (isPressed ? 0.95 : 0.85)}
        // Using onPressIn for Android compatibility - fires on touch-down before
        // micro-movements break the event (react-native-svg Android touch issue)
        onPressIn={isDisabled ? undefined : () => {
          handleStatePressIn(state); // Visual feedback
          handleStatePress(state); // Navigation
        }}
        onPressOut={isDisabled ? undefined : handleStatePressOut}
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
