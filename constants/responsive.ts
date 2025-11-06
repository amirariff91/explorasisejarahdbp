/**
 * Responsive Utilities for Landscape-Only App
 * Device category detection and responsive sizing helpers
 */

import { Breakpoints } from './layout';

// Device category helper
export const getDeviceCategory = (width: number): 'phone' | 'tablet' => {
  return width < 1000 ? 'phone' : 'tablet';
};

// Get responsive button size
export const getResponsiveButtonSize = <T extends { phone: any; tablet: any }>(
  sizeConfig: T,
  width: number
): T['phone'] | T['tablet'] => {
  return getDeviceCategory(width) === 'phone' ? sizeConfig.phone : sizeConfig.tablet;
};
