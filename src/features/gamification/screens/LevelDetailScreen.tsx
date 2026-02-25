// Level Detail Screen - Shows detailed level content
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
import { useProgressStore } from '../../../core/storage/progressStore';
import { Button, Card } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';
import { Level } from '../../../shared/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LevelDetailRouteProp = RouteProp<RootStackParamList, 'LevelDetail'>;

// 岛屿信息
const ISLANDS = [
  { id: 1, name: '新手村', color: '#58CC02' },
  { id: 2, name: 'KTV麦霸集训营', color: '#FFC107' },
  { id: 3, name: '进阶歌手工坊', color: '#FF9800' },
  { id: 4, name: '艺术家殿堂', color: '#F44336' },
];

const LevelDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<LevelDetailRouteProp>();
  const { levelId } = route.params;
  const { chapters } = useProgressStore();

  // Find the level
  let level: Level | null = null;
  let chapterTitle = '';
  let islandName = '';
  let islandColor = colors.primary;

  for (const chapter of chapters) {
    const found = chapter.levels.find(l => l.id === levelId);
    if (found) {
      level = found;
      chapterTitle = chapter.title;
      const island = ISLANDS.find(i => i.id === chapter.islandId);
      if (island) {
        islandName = island.name;
        islandColor = island.color;
      }
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
    navigation.navigate('Learning', { taskId: level!.id });
  };

  // 获取星级显示
  const renderStars = () => {
    const stars = level?.stars || 0;
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map(i => (
          <Text
            key={i}
            style={[
              styles.star,
              { color: i <= stars ? colors.warning : colors.border }
            ]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.levelBadge, { backgroundColor: islandColor }]}>
            <Text style={styles.levelIcon}>{level.icon || '🎵'}</Text>
          </View>
          <Text style={styles.title}>{level.title}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.chapter}>{chapterTitle}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.island}>{islandName}</Text>
          </View>
          {renderStars()}
        </View>

        {/* Description */}
        <Card style={styles.descCard}>
          <Text style={styles.descTitle}>关卡介绍</Text>
          <Text style={styles.descText}>{level.description}</Text>
        </Card>

        {/* Practice Content */}
        {level.practiceContent && (
          <Card style={styles.contentCard}>
            <Text style={styles.contentTitle}>📝 练习内容</Text>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceLabel}>练习文本：</Text>
              <Text style={styles.practiceValue}>{level.practiceContent.exerciseText}</Text>
            </View>
            {level.practiceContent.exercisePhonetic && (
              <View style={styles.practiceItem}>
                <Text style={styles.practiceLabel}>注音：</Text>
                <Text style={styles.practiceValue}>{level.practiceContent.exercisePhonetic}</Text>
              </View>
            )}
            {level.practiceContent.notes && level.practiceContent.notes.length > 0 && (
              <View style={styles.practiceItem}>
                <Text style={styles.practiceLabel}>目标音符：</Text>
                <Text style={styles.practiceValue}>{level.practiceContent.notes.join(' - ')}</Text>
              </View>
            )}
            {level.practiceContent.bpm && (
              <View style={styles.practiceItem}>
                <Text style={styles.practiceLabel}>节拍速度：</Text>
                <Text style={styles.practiceValue}>{level.practiceContent.bpm} BPM</Text>
              </View>
            )}
            {level.practiceContent.duration && (
              <View style={styles.practiceItem}>
                <Text style={styles.practiceLabel}>持续时间：</Text>
                <Text style={styles.practiceValue}>{level.practiceContent.duration} 秒</Text>
              </View>
            )}
          </Card>
        )}

        {/* Target Stars */}
        {level.target && (
          <Card style={styles.targetCard}>
            <Text style={styles.targetTitle}>⭐ 星级目标</Text>
            <View style={styles.targetRow}>
              <View style={styles.targetItem}>
                <Text style={styles.targetStar}>⭐</Text>
                <Text style={styles.targetScore}>{level.target.oneStar}分</Text>
                <Text style={styles.targetLabel}>通过</Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetStar}>⭐⭐</Text>
                <Text style={styles.targetScore}>{level.target.twoStar}分</Text>
                <Text style={styles.targetLabel}>良好</Text>
              </View>
              <View style={styles.targetItem}>
                <Text style={styles.targetStar}>⭐⭐⭐</Text>
                <Text style={styles.targetScore}>{level.target.threeStar}分</Text>
                <Text style={styles.targetLabel}>完美</Text>
              </View>
            </View>
          </Card>
        )}

        {/* Detection Metrics */}
        {level.detectionMetrics && (
          <Card style={styles.metricsCard}>
            <Text style={styles.metricsTitle}>🎯 评分指标</Text>
            <View style={styles.metricsList}>
              {level.detectionMetrics.metrics.map((metric, index) => (
                <View key={index} style={styles.metricItem}>
                  <Text style={styles.metricBullet}>•</Text>
                  <Text style={styles.metricText}>{metric}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Tips */}
        {level.tips && level.tips.length > 0 && (
          <Card style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 练习提示</Text>
            <View style={styles.tipsList}>
              {level.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>{index + 1}.</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  levelBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  levelIcon: {
    fontSize: 36,
  },
  title: {
    ...typography.displaySmall,
    color: colors.text,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  chapter: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  separator: {
    marginHorizontal: spacing.sm,
    color: colors.textTertiary,
  },
  island: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  starsContainer: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  star: {
    fontSize: 24,
    marginHorizontal: 2,
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
  contentCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
  },
  contentTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  practiceItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  practiceLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    width: 80,
  },
  practiceValue: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
  targetCard: {
    marginBottom: spacing.md,
  },
  targetTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  targetItem: {
    alignItems: 'center',
  },
  targetStar: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  targetScore: {
    ...typography.headingMedium,
    color: colors.primary,
  },
  targetLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  metricsCard: {
    marginBottom: spacing.md,
  },
  metricsTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  metricsList: {
    gap: spacing.sm,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricBullet: {
    color: colors.primary,
    marginRight: spacing.sm,
    fontSize: 16,
  },
  metricText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  tipsCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.warningLight,
  },
  tipsTitle: {
    ...typography.headingSmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    color: colors.text,
    marginRight: spacing.sm,
    fontWeight: 'bold',
  },
  tipText: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
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
  errorText: {
    ...typography.bodyLarge,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});

export default LevelDetailScreen;
