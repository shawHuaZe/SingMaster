// Practice Home Screen - Level Selection
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgressStore, mockChapters } from '../../../core/storage/progressStore';
import { Card } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';
import { Chapter, Level } from '../../../shared/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PracticeHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { progress, chapters, loadProgress } = useProgressStore();

  useEffect(() => {
    loadProgress();
  }, []);

  const renderLevel = (level: Level, chapterIndex: number) => {
    const isUnlocked = level.isUnlocked;
    const isCompleted = level.isCompleted;

    return (
      <TouchableOpacity
        key={level.id}
        style={[
          styles.levelItem,
          !isUnlocked && styles.levelLocked,
          isCompleted && styles.levelCompleted,
        ]}
        onPress={() => isUnlocked && navigation.navigate('LevelDetail', { levelId: level.id })}
        disabled={!isUnlocked}
      >
        <View
          style={[
            styles.levelIcon,
            isCompleted && styles.levelIconCompleted,
          ]}
        >
          {isCompleted ? (
            <Text style={styles.levelIconText}>✓</Text>
          ) : isUnlocked ? (
            <Text style={styles.levelNumber}>{level.levelNumber}</Text>
          ) : (
            <Text style={styles.levelIconText}>🔒</Text>
          )}
        </View>
        <View style={styles.levelInfo}>
          <Text
            style={[
              styles.levelTitle,
              !isUnlocked && styles.levelTitleLocked,
            ]}
          >
            {level.title}
          </Text>
          <Text style={styles.levelDesc}>{level.description}</Text>
        </View>
        {level.bestScore !== undefined && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{level.bestScore}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderChapter = (chapter: Chapter, index: number) => {
    const isUnlocked = index <= progress.currentChapter + 1;
    const completedCount = chapter.levels.filter(l => l.isCompleted).length;

    return (
      <View key={chapter.id} style={styles.chapterCard}>
        <View style={styles.chapterHeader}>
          <View style={styles.chapterNumber}>
            <Text style={styles.chapterNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.chapterDesc}>{chapter.description}</Text>
          </View>
          <View style={styles.chapterProgress}>
            <Text style={styles.progressText}>
              {completedCount}/{chapter.levels.length}
            </Text>
          </View>
        </View>
        <View style={styles.levelsContainer}>
          {chapter.levels.map(level => renderLevel(level, index))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>选择关卡</Text>
          <Text style={styles.headerSubtitle}>
            共 {chapters.length} 个章节，{chapters.reduce((sum, c) => sum + c.levels.length, 0)} 个关卡
          </Text>
        </View>

        {/* Chapters */}
        {chapters.map((chapter, index) => renderChapter(chapter, index))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTitle: {
    ...typography.headingLarge,
    color: colors.text,
  },
  headerSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  chapterCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary,
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  chapterNumberText: {
    ...typography.headingMedium,
    color: '#FFFFFF',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    ...typography.headingMedium,
    color: '#FFFFFF',
  },
  chapterDesc: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  chapterProgress: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
  },
  progressText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
  levelsContainer: {
    padding: spacing.md,
  },
  levelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.sm,
  },
  levelLocked: {
    opacity: 0.5,
  },
  levelCompleted: {
    backgroundColor: colors.successLight,
  },
  levelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  levelIconCompleted: {
    backgroundColor: colors.success,
  },
  levelIconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    ...typography.labelLarge,
    color: colors.text,
  },
  levelTitleLocked: {
    color: colors.textTertiary,
  },
  levelDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scoreBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  scoreText: {
    ...typography.labelSmall,
    color: '#FFFFFF',
  },
});

export default PracticeHomeScreen;
