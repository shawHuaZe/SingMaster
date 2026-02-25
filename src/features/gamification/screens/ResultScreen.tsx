// Result Screen - After Practice
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResultRouteProp = RouteProp<RootStackParamList, 'Result'>;

const ResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultRouteProp>();
  const { score, levelId } = route.params;

  const getGrade = (score: number) => {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return colors.success;
      case 'A': return colors.primary;
      case 'B': return colors.secondary;
      case 'C': return colors.warning;
      default: return colors.error;
    }
  };

  const getMessage = (score: number) => {
    if (score >= 90) return '太棒了！完美演绎！🌟';
    if (score >= 80) return '非常好！继续加油！💪';
    if (score >= 70) return '很不错！还有进步空间！🎵';
    if (score >= 60) return '及格啦！多加练习会更好！👍';
    return '别灰心！再试一次！💪';
  };

  const grade = getGrade(score);
  const gradeColor = getGradeColor(grade);

  const handleRetry = () => {
    navigation.replace('Practice', { levelId });
  };

  const handleContinue = () => {
    navigation.navigate('Main', { screen: 'Home' } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Result Display */}
        <View style={styles.resultSection}>
          <View style={[styles.gradeCircle, { borderColor: gradeColor }]}>
            <Text style={[styles.grade, { color: gradeColor }]}>{grade}</Text>
          </View>
          <Text style={styles.score}>{score}分</Text>
          <Text style={styles.message}>{getMessage(score)}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🎵</Text>
            <Text style={styles.statLabel}>音准</Text>
            <Text style={[styles.statScore, { color: colors.primary }]}>
              {Math.round(score * 0.9)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>🥁</Text>
            <Text style={styles.statLabel}>节奏</Text>
            <Text style={[styles.statScore, { color: colors.secondary }]}>
              {Math.round(score * 0.85)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>📊</Text>
            <Text style={styles.statLabel}>稳定</Text>
            <Text style={[styles.statScore, { color: colors.success }]}>
              {Math.round(score * 0.95)}
            </Text>
          </View>
        </View>

        {/* XP Earned */}
        <View style={styles.xpSection}>
          <Text style={styles.xpLabel}>获得经验值</Text>
          <Text style={styles.xpValue}>+{Math.round(score / 10)} XP</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="再练习一次"
            onPress={handleRetry}
            variant="outline"
            size="large"
            style={styles.retryButton}
          />
          <Button
            title="继续学习"
            onPress={handleContinue}
            size="large"
            style={styles.continueButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
    justifyContent: 'center',
  },
  resultSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  gradeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  grade: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  score: {
    ...typography.score,
    color: colors.text,
  },
  message: {
    ...typography.headingMedium,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
    borderRadius: spacing.radiusMd,
    minWidth: 90,
  },
  statValue: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  statScore: {
    ...typography.numeric,
    marginTop: spacing.xs,
  },
  xpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginBottom: spacing.xxl,
  },
  xpLabel: {
    ...typography.bodyMedium,
    color: colors.text,
    marginRight: spacing.sm,
  },
  xpValue: {
    ...typography.headingMedium,
    color: colors.primary,
  },
  actions: {
    gap: spacing.md,
  },
  retryButton: {
    marginBottom: spacing.sm,
  },
  continueButton: {},
});

export default ResultScreen;
