import { View, StyleSheet, useWindowDimensions } from 'react-native';
import type { ReactNode } from 'react';
import { isLandscapeMode, getEdgeMargin, getColumnGap } from '@/constants/layout';

interface LandscapeLayoutProps {
  header?: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  footer?: ReactNode;
  leftWidth?: number; // Flex ratio (not percentage)
  rightWidth?: number; // Flex ratio (not percentage)
  backgroundColor?: string;
  onRightSectionLayout?: (event: any) => void; // Optional layout callback for right section
}

/**
 * Landscape Layout Wrapper Component
 * Provides consistent landscape layout across quiz screens
 *
 * Supports different layout configurations:
 * - Side-by-side (question left, answers right)
 * - Full width (single section)
 * - Custom width ratios
 */
export default function LandscapeLayout({
  header,
  leftSection,
  rightSection,
  footer,
  leftWidth = 40,
  rightWidth = 58,
  backgroundColor = 'transparent',
  onRightSectionLayout,
}: LandscapeLayoutProps) {
  const { width } = useWindowDimensions();
  const isLandscape = isLandscapeMode(width);

  // Calculate responsive spacing from layout constants
  const spacing = getColumnGap(isLandscape);
  const edgeMargin = getEdgeMargin(isLandscape);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header Section */}
      {header && (
        <View style={[styles.header, { paddingHorizontal: edgeMargin }]}>
          {header}
        </View>
      )}

      {/* Main Content Area */}
      <View style={[styles.mainContent, { paddingHorizontal: edgeMargin, gap: spacing }]}>
        {/* Left Section */}
        {leftSection && (
          <View style={[styles.section, { flex: leftWidth }]}>
            {leftSection}
          </View>
        )}

        {/* Right Section */}
        {rightSection && (
          <View
            style={[styles.section, { flex: rightWidth }]}
            onLayout={onRightSectionLayout}>
            {rightSection}
          </View>
        )}

        {/* Full Width Section (if only one section provided) */}
        {!leftSection && !rightSection && (
          <View style={styles.fullWidthSection}>
            {/* Fallback content */}
          </View>
        )}
      </View>

      {/* Footer Section */}
      {footer && (
        <View style={[styles.footer, { paddingHorizontal: edgeMargin }]}>
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    zIndex: 10,
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    // flex value is set dynamically via props (flex: leftWidth or flex: rightWidth)
    // Do not set flex: 1 here as it conflicts with explicit flex ratios
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingVertical: 16,
    zIndex: 10,
  },
});
