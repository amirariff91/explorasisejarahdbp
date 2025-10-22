import { withSpring, withTiming, withSequence } from 'react-native-reanimated';

/**
 * Animation Utilities using Reanimated v4
 * Consistent, reusable animation configurations
 */

// Spring configurations
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const gentleSpring = {
  damping: 20,
  stiffness: 90,
};

// Timing configurations
export const fastTiming = { duration: 200 };
export const mediumTiming = { duration: 400 };
export const slowTiming = { duration: 600 };

// Reusable animation functions
export const fadeIn = () => withTiming(1, mediumTiming);

export const fadeOut = () => withTiming(0, fastTiming);

export const scaleIn = () => withSpring(1, springConfig);

export const scaleOut = () => withSpring(0, springConfig);

export const slideInFromBottom = () =>
  withSpring(0, { ...springConfig, damping: 18 });

export const slideInFromRight = () =>
  withSpring(0, { ...springConfig, damping: 18 });

// Button press animation
export const pressAnimation = () =>
  withSequence(withTiming(0.95, { duration: 100 }), withSpring(1, gentleSpring));

// Shake animation (for wrong answers)
export const shakeAnimation = () =>
  withSequence(
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );

// Success pulse animation
export const successPulse = () =>
  withSequence(
    withSpring(1.1, { damping: 10, stiffness: 200 }),
    withSpring(1, gentleSpring)
  );

// Rotation animation
export const rotateAnimation = (degrees: number) =>
  withTiming(degrees, { duration: 300 });
