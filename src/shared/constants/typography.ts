// Design System - Typography
import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  // Display styles
  displayLarge: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  displayMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  displaySmall: {
    fontFamily,
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },

  // Heading styles
  headingLarge: {
    fontFamily,
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  headingMedium: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  headingSmall: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600' as const,
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

  // Label styles
  labelLarge: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily,
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
  },

  // Numeric styles
  numeric: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '500' as const,
    lineHeight: 32,
  },
  score: {
    fontFamily: 'Roboto',
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 56,
  },
};

export default typography;
