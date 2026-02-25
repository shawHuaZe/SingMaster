// Practice Home Screen - Level Selection with Island Structure
import React, { useEffect, useMemo } from 'react';
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

// 岛屿信息
const ISLANDS = [
  { id: 1, name: '新手村', icon: '🟢', description: '零基础康复', color: '#58CC02' },
  { id: 2, name: 'KTV麦霸集训营', icon: '🟡', description: '声音好听化', color: '#FFC107' },
  { id: 3, name: '进阶歌手工坊', icon: '🟠', description: '混声 + 高音', color: '#FF9800' },
  { id: 4, name: '艺术家殿堂', icon: '🔴', description: '风格表达', color: '#F44336' },
];

const PracticeHomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { progress, chapters, loadProgress } = useProgressStore();

  useEffect(() => {
    loadProgress();
  }, []);

  // 按岛屿分组章节
  const chaptersByIsland = useMemo(() => {
    const grouped: { [key: number]: Chapter[] } = {};
    chapters.forEach((chapter) => {
      const islandId = chapter.islandId || 1;
      if (!grouped[islandId]) {
        grouped[islandId] = [];
      }
      grouped[islandId].push(chapter);
    });
    return grouped;
  }, [chapters]);

  // 计算岛屿解锁状态
  const isIslandUnlocked = (islandId: number): boolean => {
    if (islandId === 1) return true;
    // 检查前一岛屿是否全部完成
    const prevIslandChapters = chaptersByIsland[islandId - 1] || [];
    const allCompleted = prevIslandChapters.every((ch) =>
      ch.levels.every((lv) => lv.isCompleted)
    );
    return allCompleted;
  };

  const renderStars = (level: Level) => {
    const stars = level.stars || 0;
    if (stars === 0) return null;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((i) => (
          <Text
            key={i}
            style={[
              styles.star,
              { color: i <= stars ? colors.warning : colors.border },
            ]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  const renderLevel = (level: Level) => {
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
            <Text style={styles.levelIconText}>{level.icon || '✓'}</Text>
          ) : isUnlocked ? (
            <Text style={styles.levelIconText}>{level.icon || level.levelNumber}</Text>
          ) : (
            <Text style={styles.levelIconText}>🔒</Text>
          )}
        </View>
        <View style={styles.levelInfo}>
          <View style={styles.levelTitleRow}>
            <Text
              style={[
                styles.levelTitle,
                !isUnlocked && styles.levelTitleLocked,
              ]}
            >
              {level.title}
            </Text>
            {renderStars(level)}
          </View>
          <Text style={styles.levelDesc}>{level.description}</Text>
          {level.practiceContent?.exerciseText && (
            <Text style={styles.exerciseText}>
              练习: {level.practiceContent.exerciseText}
            </Text>
          )}
        </View>
        {level.bestScore !== undefined && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{level.bestScore}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderChapter = (chapter: Chapter, islandColor: string) => {
    const completedCount = chapter.levels.filter((l) => l.isCompleted).length;
    const totalCount = chapter.levels.length;
    const isAllCompleted = completedCount === totalCount;

    return (
      <View key={chapter.id} style={styles.chapterCard}>
        <View style={[styles.chapterHeader, { backgroundColor: islandColor }]}>
          <View style={styles.chapterNumber}>
            <Text style={styles.chapterNumberText}>{chapter.icon || chapter.unitId}</Text>
          </View>
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterTitle}>{chapter.title}</Text>
            <Text style={styles.chapterDesc}>{chapter.description}</Text>
          </View>
          <View style={styles.chapterProgress}>
            <Text style={styles.progressText}>
              {completedCount}/{totalCount}
            </Text>
          </View>
        </View>
        <View style={styles.levelsContainer}>
          {chapter.levels.map((level) => renderLevel(level))}
        </View>
      </View>
    );
  };

  const renderIsland = (islandId: number) => {
    const islandChapters = chaptersByIsland[islandId] || [];
    const island = ISLANDS.find((i) => i.id === islandId);
    if (!island || islandChapters.length === 0) return null;

    const unlocked = isIslandUnlocked(islandId);
    const totalLevels = islandChapters.reduce((sum, c) => sum + c.levels.length, 0);
    const completedLevels = islandChapters.reduce(
      (sum, c) => sum + c.levels.filter((l) => l.isCompleted).length,
      0
    );

    return (
      <View key={islandId} style={styles.islandSection}>
        {/* Island Header */}
        <TouchableOpacity
          style={[
            styles.islandHeader,
            { borderLeftColor: island.color },
            !unlocked && styles.islandLocked,
          ]}
          disabled={!unlocked}
        >
          <View style={styles.islandIcon}>
            <Text style={styles.islandIconText}>{unlocked ? island.icon : '🔒'}</Text>
          </View>
          <View style={styles.islandInfo}>
            <Text style={styles.islandName}>{island.name}</Text>
            <Text style={styles.islandDesc}>{island.description}</Text>
          </View>
          <View style={styles.islandProgress}>
            <Text style={styles.islandProgressText}>
              {completedLevels}/{totalLevels}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Chapters */}
        {islandChapters.map((chapter) => renderChapter(chapter, island.color))}
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
            共 {ISLANDS.length} 个岛屿，{chapters.reduce((sum, c) => sum + c.levels.length, 0)} 个关卡
          </Text>
        </View>

        {/* Islands */}
        {ISLANDS.map((island) => renderIsland(island.id))}
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
  // Island styles
  islandSection: {
    marginBottom: spacing.xl,
  },
  islandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  islandLocked: {
    opacity: 0.6,
  },
  islandIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  islandIconText: {
    fontSize: 24,
  },
  islandInfo: {
    flex: 1,
  },
  islandName: {
    ...typography.headingMedium,
    color: colors.text,
  },
  islandDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  islandProgress: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
  },
  islandProgressText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
  // Chapter styles
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
  // Level styles
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
  levelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelTitle: {
    ...typography.labelLarge,
    color: colors.text,
  },
  levelTitleLocked: {
    color: colors.textTertiary,
  },
  starsContainer: {
    flexDirection: 'row',
    marginLeft: spacing.sm,
  },
  star: {
    fontSize: 12,
    marginRight: 2,
  },
  levelDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  exerciseText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.xs,
    fontStyle: 'italic',
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
