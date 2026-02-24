// Practice Session Screen - AI Teaching Core
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePracticeStore, mockAILessons } from '../../../core/storage/practiceStore';
import { useProgressStore } from '../../../core/storage/progressStore';
import { Button } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';
import { AITeachingStep } from '../../../shared/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type PracticeRouteProp = RouteProp<RootStackParamList, 'Practice'>;

const PracticeSessionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PracticeRouteProp>();
  const { levelId } = route.params;

  const {
    currentLesson,
    currentStepIndex,
    isPlayingDemo,
    isWaitingForUser,
    isRecording,
    realTimePitch,
    startLesson,
    nextStep,
    setPlayingDemo,
    setWaitingForUser,
    endSession,
    completeLesson,
  } = usePracticeStore();

  const { completeLesson: saveProgress } = useProgressStore();

  const [pulseAnim] = useState(new Animated.Value(1));

  // Initialize lesson
  useEffect(() => {
    const lesson = mockAILessons[levelId] || mockAILessons['level_1_1'];
    startLesson(lesson);
  }, [levelId]);

  // Pulse animation for recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const currentStep = currentLesson?.steps[currentStepIndex];
  const isLastStep = currentStepIndex >= (currentLesson?.steps.length || 0) - 1;

  const handleNext = async () => {
    if (isLastStep) {
      // Complete the lesson
      const score = await endSession();
      if (score) {
        await saveProgress(levelId, score.totalScore);
        navigation.replace('Result', { score: score.totalScore, levelId });
      }
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'demonstrate':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.demoIcon}>
              <Text style={styles.demoEmoji}>🎤</Text>
            </View>
            <Text style={styles.stepText}>{currentStep.content.text}</Text>
            <Button
              title="播放示范"
              onPress={() => {
                setPlayingDemo(true);
                setTimeout(() => {
                  setPlayingDemo(false);
                }, currentStep.duration || 3000);
              }}
              loading={isPlayingDemo}
              style={styles.actionButton}
            />
          </View>
        );

      case 'listen':
        return (
          <View style={styles.stepContainer}>
            <Animated.View
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.recordEmoji}>🎙️</Text>
            </Animated.View>
            <Text style={styles.stepText}>{currentStep.content.text}</Text>
            <Text style={styles.hintText}>
              {isRecording ? '正在录音...' : '点击开始录音'}
            </Text>
          </View>
        );

      case 'feedback':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.feedbackIcon}>
              <Text style={styles.feedbackEmoji}>💡</Text>
            </View>
            <Text style={styles.stepText}>{currentStep.content.text}</Text>
            {currentStep.content.suggestions && (
              <View style={styles.suggestions}>
                {currentStep.content.suggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Text style={styles.suggestionBullet}>•</Text>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'repeat':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.repeatIcon}>
              <Text style={styles.repeatEmoji}>🔄</Text>
            </View>
            <Text style={styles.stepText}>{currentStep.content.text}</Text>
            <Button
              title="播放再次示范"
              onPress={() => {
                setPlayingDemo(true);
                setTimeout(() => {
                  setPlayingDemo(false);
                }, currentStep.duration || 3000);
              }}
              loading={isPlayingDemo}
              style={styles.actionButton}
            />
          </View>
        );

      case 'complete':
        return (
          <View style={styles.stepContainer}>
            <View style={styles.completeIcon}>
              <Text style={styles.completeEmoji}>🎉</Text>
            </View>
            <Text style={styles.stepText}>{currentStep.content.text}</Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentStepIndex + 1) / (currentLesson?.steps.length || 1)) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            步骤 {currentStepIndex + 1} / {currentLesson?.steps.length || 0}
          </Text>
        </View>

        {/* AI Avatar */}
        <View style={styles.aiSection}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiEmoji}>🤖</Text>
          </View>
          <Text style={styles.aiName}>AI导师</Text>
        </View>

        {/* Step Content */}
        {renderStepContent()}

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <Button
            title={isLastStep ? '完成' : '下一步'}
            onPress={handleNext}
            size="large"
            style={styles.nextButton}
          />

          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.exitText}>退出练习</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
  },
  progressContainer: {
    marginBottom: spacing.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  aiSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  aiAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  aiEmoji: {
    fontSize: 40,
  },
  aiName: {
    ...typography.labelLarge,
    color: colors.text,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  demoIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  demoEmoji: {
    fontSize: 48,
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 4,
    borderColor: colors.error,
  },
  recordButtonActive: {
    backgroundColor: colors.error,
  },
  recordEmoji: {
    fontSize: 48,
  },
  feedbackIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  feedbackEmoji: {
    fontSize: 48,
  },
  repeatIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.info,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  repeatEmoji: {
    fontSize: 48,
  },
  completeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  completeEmoji: {
    fontSize: 48,
  },
  stepText: {
    ...typography.bodyLarge,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: spacing.xl,
  },
  hintText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  suggestions: {
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  suggestionBullet: {
    color: colors.primary,
    marginRight: spacing.sm,
  },
  suggestionText: {
    ...typography.bodyMedium,
    color: colors.text,
    flex: 1,
  },
  actionButton: {
    minWidth: 160,
  },
  bottomSection: {
    paddingTop: spacing.lg,
  },
  nextButton: {
    marginBottom: spacing.md,
  },
  exitButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  exitText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
});

export default PracticeSessionScreen;
