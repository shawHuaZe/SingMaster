// Progress Screen
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useProgressStore, mockChapters } from '../../../core/storage/progressStore';
import { useUserStore } from '../../../core/storage/userStore';
import { Card } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';

const ProgressScreen: React.FC = () => {
  const { progress, loadProgress } = useProgressStore();
  const { user } = useUserStore();

  useEffect(() => {
    loadProgress();
  }, []);

  const totalLevels = mockChapters.reduce((sum, c) => sum + c.levels.length, 0);
  const completedLevels = progress.completedLessons.length;
  const completionRate = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Stats */}
        <View style={styles.statsHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.nickname?.charAt(0) || '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.nickname || '歌手'}</Text>
              <Text style={styles.userLevel}>等级 {user?.level || 1}</Text>
            </View>
          </View>
          <View style={styles.xpInfo}>
            <Text style={styles.xpLabel}>经验值</Text>
            <Text style={styles.xpValue}>{user?.experience || 0} XP</Text>
          </View>
        </View>

        {/* Progress Overview */}
        <Card style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>学习进度</Text>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>{completionRate}%</Text>
            <Text style={styles.progressLabel}>完成度</Text>
          </View>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{completedLevels}</Text>
              <Text style={styles.progressStatLabel}>已完成</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{totalLevels - completedLevels}</Text>
              <Text style={styles.progressStatLabel}>待完成</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>{totalLevels}</Text>
              <Text style={styles.progressStatLabel}>总关卡</Text>
            </View>
          </View>
        </Card>

        {/* Practice Stats */}
        <Card style={styles.practiceCard}>
          <Text style={styles.sectionTitle}>练习统计</Text>
          <View style={styles.practiceStats}>
            <View style={styles.practiceStat}>
              <Text style={styles.practiceEmoji}>⏱️</Text>
              <Text style={styles.practiceValue}>
                {Math.round((progress.totalPracticeTime || 0) / 60)}
              </Text>
              <Text style={styles.practiceLabel}>分钟</Text>
            </View>
            <View style={styles.practiceStat}>
              <Text style={styles.practiceEmoji}>🔥</Text>
              <Text style={styles.practiceValue}>{progress.streak || 0}</Text>
              <Text style={styles.practiceLabel}>连续天数</Text>
            </View>
            <View style={styles.practiceStat}>
              <Text style={styles.practiceEmoji}>🏆</Text>
              <Text style={styles.practiceValue}>
                {mockChapters.reduce((sum, c) =>
                  sum + c.levels.filter(l => l.isCompleted).length, 0
                )}
              </Text>
              <Text style={styles.practiceLabel}>成就</Text>
            </View>
          </View>
        </Card>

        {/* Chapter Progress */}
        <Text style={styles.chapterTitle}>章节进度</Text>
        {mockChapters.map((chapter, index) => {
          const completed = chapter.levels.filter(l => l.isCompleted).length;
          const total = chapter.levels.length;
          const percent = Math.round((completed / total) * 100);

          return (
            <Card key={chapter.id} style={styles.chapterCard}>
              <View style={styles.chapterHeader}>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterName}>{chapter.title}</Text>
                  <Text style={styles.chapterDesc}>{chapter.description}</Text>
                </View>
                <Text style={styles.chapterPercent}>{percent}%</Text>
              </View>
              <View style={styles.chapterProgressBar}>
                <View
                  style={[styles.chapterProgressFill, { width: `${percent}%` }]}
                />
              </View>
              <Text style={styles.chapterProgressText}>
                {completed}/{total} 关卡
              </Text>
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.screenPadding,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userName: {
    ...typography.headingMedium,
    color: colors.text,
  },
  userLevel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  xpInfo: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
  },
  xpLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  xpValue: {
    ...typography.labelLarge,
    color: colors.primary,
  },
  overviewCard: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headingMedium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  progressCircle: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressPercent: {
    ...typography.score,
    color: colors.primary,
  },
  progressLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressValue: {
    ...typography.numeric,
    color: colors.text,
  },
  progressStatLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  practiceCard: {
    marginBottom: spacing.xl,
  },
  practiceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  practiceStat: {
    alignItems: 'center',
  },
  practiceEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  practiceValue: {
    ...typography.numeric,
    color: colors.text,
  },
  practiceLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  chapterTitle: {
    ...typography.headingMedium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  chapterCard: {
    marginBottom: spacing.md,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  chapterNumberText: {
    ...typography.labelMedium,
    color: '#FFFFFF',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterName: {
    ...typography.labelLarge,
    color: colors.text,
  },
  chapterDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  chapterPercent: {
    ...typography.labelLarge,
    color: colors.primary,
  },
  chapterProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  chapterProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  chapterProgressText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
});

export default ProgressScreen;
