// Design System - Duolingo Style Typography
import { Platform } from 'react-native';

// Use system fonts - Nunito-like rounded fonts preferred
const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Display styles - Duolingo style: bold, impactful
  displayLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: 0.5,
  },
  displayMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  displaySmall: {
    fontFamily,
    fontSize: 24,
    fontWeight: '800' as const,
    lineHeight: 32,
    letterSpacing: 0.5,
  },

  // Heading styles - bold and clear
  headingLarge: {
    fontFamily,
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  headingMedium: {
    fontFamily,
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
  },
  headingSmall: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 22,
  },

  // Body styles
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },

  // Label styles - bold for buttons
  labelLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  labelSmall: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },

  // Numeric styles
  numeric: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  score: {
    fontFamily: 'Roboto',
    fontSize: 48,
    fontWeight: '800' as const,
    lineHeight: 56,
  },
};

export default typography;
