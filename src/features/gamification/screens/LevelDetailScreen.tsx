// Level Detail Screen
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgressStore, mockChapters } from '../../../core/storage/progressStore';
import { Button, Card } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LevelDetailRouteProp = RouteProp<RootStackParamList, 'LevelDetail'>;

const LevelDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LevelDetailRouteProp>();
  const { levelId } = route.params;
  const { chapters } = useProgressStore();

  // Find the level
  let level: any = null;
  let chapterTitle = '';

  for (const chapter of chapters) {
    const found = chapter.levels.find(l => l.id === levelId);
    if (found) {
      level = found;
      chapterTitle = chapter.title;
      break;
    }
  }

  if (!level) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>关卡不存在</Text>
      </SafeAreaView>
    );
  }

  const handleStartPractice = () => {
    navigation.navigate('Practice', { levelId: level.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>LV.{level.levelNumber}</Text>
          </View>
          <Text style={styles.title}>{level.title}</Text>
          <Text style={styles.chapter}>{chapterTitle}</Text>
        </View>

        {/* Description */}
        <Card style={styles.descCard}>
          <Text style={styles.descTitle}>关卡介绍</Text>
          <Text style={styles.descText}>{level.description}</Text>
        </Card>

        {/* Learning Objectives */}
        <Card style={styles.objectivesCard}>
          <Text style={styles.objectivesTitle}>学习目标</Text>
          <View style={styles.objectiveList}>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveBullet}>✓</Text>
              <Text style={styles.objectiveText}>掌握基本技能</Text>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveBullet}>✓</Text>
              <Text style={styles.objectiveText}>通过AI实时反馈提升</Text>
            </View>
            <View style={styles.objectiveItem}>
              <Text style={styles.objectiveBullet}>✓</Text>
              <Text style={styles.objectiveText}>完成关卡获得经验值</Text>
            </View>
          </View>
        </Card>

        {/* Best Score */}
        {level.bestScore !== undefined && (
          <Card style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>历史最高分</Text>
            <Text style={styles.scoreValue}>{level.bestScore}</Text>
          </Card>
        )}

        {/* Start Button */}
        <Button
          title={level.isCompleted ? '再次挑战' : '开始练习'}
          onPress={handleStartPractice}
          size="large"
          style={styles.startButton}
        />

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 练习小贴士</Text>
          <Text style={styles.tipsText}>
            建议在安静的环境下练习，使用耳机可以获得更好的体验。每次练习后注意听AI导师的反馈，这是进步的关键！
          </Text>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  levelBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusFull,
    marginBottom: spacing.md,
  },
  levelNumber: {
    ...typography.labelLarge,
    color: '#FFFFFF',
  },
  title: {
    ...typography.displaySmall,
    color: colors.text,
    textAlign: 'center',
  },
  chapter: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  descCard: {
    marginBottom: spacing.md,
  },
  descTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  objectivesCard: {
    marginBottom: spacing.md,
  },
  objectivesTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  objectiveList: {
    gap: spacing.sm,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  objectiveBullet: {
    color: colors.success,
    marginRight: spacing.sm,
    fontSize: 16,
  },
  objectiveText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  scoreCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  scoreLabel: {
    ...typography.labelMedium,
    color: colors.textSecondary,
  },
  scoreValue: {
    ...typography.score,
    color: colors.primary,
  },
  startButton: {
    marginBottom: spacing.lg,
  },
  tips: {
    backgroundColor: colors.warningLight,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
  },
  tipsTitle: {
    ...typography.labelLarge,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  tipsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    ...typography.bodyLarge,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});

export default LevelDetailScreen;
