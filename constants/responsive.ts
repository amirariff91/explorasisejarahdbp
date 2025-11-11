/**
 * Responsive Utilities for Landscape-Only App
 * Device category detection and responsive sizing helpers
 *
 * ⚠️ DEPRECATED: This file is deprecated and kept for backward compatibility only.
 *
 * The 2-tier system (phone/tablet with 1000px breakpoint) has been replaced
 * by a comprehensive 4-tier responsive system with unified breakpoints.
 *
 * Migration Guide:
 * ================
 *
 * OLD (2-tier, responsive.ts):
 * ```typescript
 * const category = getDeviceCategory(width); // 'phone' | 'tablet'
 * const size = getResponsiveButtonSize(ButtonSizes.menu, width);
 * ```
 *
 * NEW (4-tier, layout.ts):
 * ```typescript
 * import { getDeviceSize, getScaleFactor, getResponsiveSizeScaled } from '@/constants/layout';
 *
 * const deviceSize = getDeviceSize(width); // 'phone' | 'tablet-sm' | 'tablet-md' | 'tablet-lg'
 * const scaleFactor = getScaleFactor(width); // 1.0, 1.2, 1.5, or 1.8
 * const size = getResponsiveSizeScaled(baseSize, width); // Auto-scales with max limit
 * ```
 *
 * Benefits of new system:
 * - Granular 4-tier device classification (800px, 1000px, 1200px breakpoints)
 * - Automatic scaling with configurable max limits
 * - Unified breakpoints across layout and theme constants
 * - Better iPad Pro and large tablet support
 *
 * See constants/layout.ts for full API documentation.
 */

import { Breakpoints } from './layout';

/**
 * Device category helper
 * @deprecated Use `getDeviceSize()` from '@/constants/layout' instead for 4-tier device classification.
 */
export const getDeviceCategory = (width: number): 'phone' | 'tablet' => {
  return width < 1000 ? 'phone' : 'tablet';
};

/**
 * Get responsive button size
 * @deprecated Use `getResponsiveSizeScaled()` from '@/constants/layout' instead for flexible responsive sizing.
 */
export const getResponsiveButtonSize = <T extends { phone: any; tablet: any }>(
  sizeConfig: T,
  width: number
): T['phone'] | T['tablet'] => {
  return getDeviceCategory(width) === 'phone' ? sizeConfig.phone : sizeConfig.tablet;
};
