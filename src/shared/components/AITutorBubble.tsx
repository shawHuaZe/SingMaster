// AI Tutor Bubble Component
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AIAvatar } from '../../shared/types/training';
import { colors, spacing } from '../constants';

interface AITutorBubbleProps {
  avatar: AIAvatar;
  message: string;
}

export const AITutorBubble: React.FC<AITutorBubbleProps> = ({ avatar, message }) => {
  return (
    <View style={styles.container}>
      {/* AI Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: avatar.imageUrl }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      {/* Speech Bubble */}
      <View style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <Text style={styles.message}>{message}</Text>
        </View>
        {/* Triangle indicator */}
        <View style={styles.triangle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.warningLight,
    flexShrink: 0,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  bubbleContainer: {
    flex: 1,
    position: 'relative',
  },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  triangle: {
    position: 'absolute',
    left: -10,
    top: 0,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: colors.surface,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
  },
  message: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});

export default AITutorBubble;
