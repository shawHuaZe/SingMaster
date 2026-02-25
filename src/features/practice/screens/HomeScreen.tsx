// Home Screen
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
import { useUserStore } from '../../../core/storage/userStore';
import { useProgressStore, mockChapters } from '../../../core/storage/progressStore';
import { Card, Button } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUserStore();
  const { progress, loadProgress } = useProgressStore();

  useEffect(() => {
    loadProgress();
  }, []);

  const currentChapter = mockChapters[progress.currentChapter];
  const currentLevel = currentChapter?.levels[progress.currentLevel];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>你好，{user?.nickname || '歌手'} 👋</Text>
            <Text style={styles.subGreeting}>今天也要继续练习吗？</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={styles.streakCount}>{progress.streak || 0}</Text>
          </View>
        </View>

        {/* Daily Goal Card */}
        <Card style={styles.dailyCard}>
          <View style={styles.dailyHeader}>
            <Text style={styles.dailyTitle}>今日目标</Text>
            <Text style={styles.dailyProgress}>
              {progress.completedLessons.length % 5}/5
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progress.completedLessons.length % 5) * 20}%` },
              ]}
            />
          </View>
          <Text style={styles.dailyHint}>
            完成今日目标获得额外经验值！
          </Text>
        </Card>

        {/* Continue Learning */}
        {currentLevel && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>继续学习</Text>
            <Card
              style={styles.continueCard}
              onPress={() => navigation.navigate('LevelDetail', { levelId: currentLevel.id })}
            >
              <View style={styles.continueContent}>
                <View style={styles.continueIcon}>
                  <Text style={styles.moduleEmoji}>🎵</Text>
                </View>
                <View style={styles.continueInfo}>
                  <Text style={styles.continueTitle}>{currentLevel.title}</Text>
                  <Text style={styles.continueDesc}>{currentLevel.description}</Text>
                  <Button
                    title="继续练习"
                    onPress={() => navigation.navigate('LevelDetail', { levelId: currentLevel.id })}
                    size="small"
                    style={styles.continueButton}
                  />
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Quick Start */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快速开始</Text>
          <View style={styles.quickGrid}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('Practice', { levelId: 'level_1_1' })}
            >
              <Text style={styles.quickIcon}>🌬️</Text>
              <Text style={styles.quickLabel}>腹式呼吸</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('Practice', { levelId: 'level_2_1' })}
            >
              <Text style={styles.quickIcon}>🎼</Text>
              <Text style={styles.quickLabel}>音准训练</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickIcon}>📊</Text>
              <Text style={styles.quickLabel}>能力测试</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard}>
              <Text style={styles.quickIcon}>🎤</Text>
              <Text style={styles.quickLabel}>AI对话</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学习统计</Text>
          <View style={styles.statsRow}>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{progress.totalPracticeTime || 0}</Text>
              <Text style={styles.statLabel}>练习时长(分钟)</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.statValue}>{progress.completedLessons.length}</Text>
              <Text style={styles.statLabel}>已完成关卡</Text>
            </Card>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.headingLarge,
    color: colors.text,
  },
  subGreeting: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
  },
  streakIcon: {
    fontSize: 18,
  },
  streakCount: {
    ...typography.labelLarge,
    color: colors.text,
    marginLeft: spacing.xs,
  },
  dailyCard: {
    marginBottom: spacing.xl,
    // Duolingo shadow
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dailyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dailyTitle: {
    ...typography.headingMedium,
    color: colors.text,
  },
  dailyProgress: {
    ...typography.labelLarge,
    color: colors.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: spacing.radiusSm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    // Duolingo inner shadow
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: spacing.radiusSm,
  },
  dailyHint: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headingMedium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  continueCard: {
    backgroundColor: colors.primary,
    // Duolingo shadow
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  moduleEmoji: {
    fontSize: 28,
  },
  continueInfo: {
    flex: 1,
  },
  continueTitle: {
    ...typography.headingMedium,
    color: '#FFFFFF',
  },
  continueDesc: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  continueButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusXxl,
    padding: spacing.lg,
    alignItems: 'center',
    // Duolingo shadow
    borderWidth: 2,
    borderColor: colors.border,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  quickIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  quickLabel: {
    ...typography.labelMedium,
    color: colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    // Duolingo shadow
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  statValue: {
    ...typography.numeric,
    color: colors.primary,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default HomeScreen;
