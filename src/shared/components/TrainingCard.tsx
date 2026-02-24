// Training Card Component - Displays lyrics with pitch/breath markers
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrainingTask, LyricSyllable } from '../../shared/types/training';
import { colors, spacing } from '../constants';

interface TrainingCardProps {
  task: TrainingTask;
}

// Pitch arrow icons mapping
const getPitchIcon = (pitch?: string): string => {
  switch (pitch) {
    case 'up': return '↑';
    case 'down': return '↓';
    case 'rise': return '↗';
    case 'fall': return '↘';
    case 'flat': return '→';
    default: return '';
  }
};

const getPitchColor = (pitch?: string): string => {
  switch (pitch) {
    case 'up':
    case 'rise':
      return colors.info;
    case 'down':
    case 'fall':
      return colors.secondary;
    default:
      return colors.textTertiary;
  }
};

export const TrainingCard: React.FC<TrainingCardProps> = ({ task }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.icon}>🎤</Text>
        <Text style={styles.title}>{task.title}</Text>
      </View>
      <Text style={styles.description}>{task.description}</Text>

      {/* Lyrics Display */}
      <View style={styles.lyricsContainer}>
        {task.syllables.map((syllable, index) => (
          <React.Fragment key={syllable.id || index}>
            {syllable.isBreathMark ? (
              // Breath mark (vertical line)
              <View style={styles.breathMark} />
            ) : (
              // Syllable with pitch marker
              <View style={styles.syllableContainer}>
                {syllable.pitch && (
                  <View style={styles.pitchContainer}>
                    <Text style={[styles.pitchIcon, { color: getPitchColor(syllable.pitch) }]}>
                      {getPitchIcon(syllable.pitch)}
                    </Text>
                  </View>
                )}
                <Text style={[
                  styles.lyricText,
                  syllable.emphasis && styles.emphasisText
                ]}>
                  {syllable.text}
                </Text>
                {syllable.emphasis && (
                  <View style={styles.emphasisDot} />
                )}
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  lyricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    minHeight: 100,
  },
  syllableContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  pitchContainer: {
    marginBottom: 4,
  },
  pitchIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
  lyricText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  emphasisText: {
    color: colors.primary,
  },
  emphasisDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    position: 'absolute',
    bottom: -15,
    alignSelf: 'center',
  },
  breathMark: {
    width: 2,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 4,
    alignSelf: 'center',
  },
});

export default TrainingCard;
