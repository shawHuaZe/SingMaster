// Learning Screen - Main Practice Interface
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProgressStore } from '../../../core/storage/progressStore';
import { TrainingCard } from '../../../shared/components/TrainingCard';
import { AITutorBubble } from '../../../shared/components/AITutorBubble';
import {
  defaultTrainingTasks,
  defaultAIAvatar,
  TrainingTask,
  LyricSyllable,
  AIAvatar,
} from '../../../shared/types/training';
import { Button } from '../../../shared/components';
import { colors, spacing, typography } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LearningScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { completeLesson: saveProgress } = useProgressStore();

  // State
  const [currentTask, setCurrentTask] = useState<TrainingTask>(defaultTrainingTasks[0]);
  const [aiAvatar] = useState<AIAvatar>(defaultAIAvatar);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingAnim] = useState(new Animated.Value(1));
  const [currentMessage, setCurrentMessage] = useState('你好！我是你的AI歌唱导师。今天我们要学习气口训练。点击麦克风开始录制你的演唱~');
  const [taskIndex, setTaskIndex] = useState(0);

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorDesc, setEditorDesc] = useState('');
  const [editorGoal, setEditorGoal] = useState('');
  const [editorLyrics, setEditorLyrics] = useState('');

  // Recording animation
  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      recordingAnim.setValue(1);
    }
  }, [isRecording]);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setCurrentMessage('正在录音...请开始演唱！');
    } else {
      // Mock feedback after recording
      setTimeout(() => {
        setCurrentMessage('很好！你的气口处理得很不错。继续练习下一句吧！');
      }, 1000);
    }
  };

  const handleNextTask = () => {
    const nextIndex = (taskIndex + 1) % defaultTrainingTasks.length;
    setTaskIndex(nextIndex);
    setCurrentTask(defaultTrainingTasks[nextIndex]);
    setCurrentMessage(`很好！现在我们来练习：${defaultTrainingTasks[nextIndex].goal}`);
  };

  const handleAddTask = () => {
    if (!editorTitle || !editorLyrics) return;

    // Parse lyrics (simple format: 文本,重音|文本)
    const syllables: LyricSyllable[] = editorLyrics.split(',').map((item, index) => {
      const isEmphasis = item.includes('*');
      const isBreath = item.includes('|');
      const text = item.replace(/[*|]/g, '').trim();
      return {
        id: `s_${index}`,
        text,
        emphasis: isEmphasis,
        isBreathMark: isBreath,
      };
    });

    const newTask: TrainingTask = {
      id: `task_${Date.now()}`,
      title: editorTitle,
      description: editorDesc,
      goal: editorGoal,
      syllables,
    };

    // Add to tasks (in real app, save to storage)
    console.log('New task:', newTask);
    setShowEditor(false);

    // Reset editor
    setEditorTitle('');
    setEditorDesc('');
    setEditorGoal('');
    setEditorLyrics('');
  };

  const progressPercent = 75;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Progress */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* TASK Section */}
        <View style={styles.taskSection}>
          <Text style={styles.taskLabel}>
            TASK: <Text style={styles.taskGoal}>{currentTask.goal}</Text>
          </Text>
        </View>

        {/* AI Tutor Bubble */}
        <AITutorBubble
          avatar={aiAvatar}
          message={currentMessage}
        />

        {/* Training Task Card */}
        <View style={styles.cardSection}>
          <TrainingCard task={currentTask} />
        </View>

        {/* Task Navigation */}
        <View style={styles.navSection}>
          <Button
            title="下一个任务"
            onPress={handleNextTask}
            variant="outline"
            size="small"
          />
          <Button
            title="+ 添加任务"
            onPress={() => setShowEditor(true)}
            variant="ghost"
            size="small"
          />
        </View>
      </ScrollView>

      {/* Bottom Recording Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecord}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonActive,
              { transform: [{ scale: recordingAnim }] },
            ]}
          >
            <Text style={styles.recordIcon}>🎤</Text>
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.recordLabel}>
          {isRecording ? '录音中...' : '开始录音'}
        </Text>
      </View>

      {/* Task Editor Modal */}
      <Modal visible={showEditor} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加训练任务</Text>

            <TextInput
              style={styles.input}
              placeholder="任务标题（如：气口训练）"
              value={editorTitle}
              onChangeText={setEditorTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="任务描述"
              value={editorDesc}
              onChangeText={setEditorDesc}
            />
            <TextInput
              style={styles.input}
              placeholder="学习目标"
              value={editorGoal}
              onChangeText={setEditorGoal}
            />
            <TextInput
              style={[styles.input, styles.lyricsInput]}
              placeholder="歌词（用逗号分隔，*表示重音，|表示气口）"
              value={editorLyrics}
              onChangeText={setEditorLyrics}
              multiline
            />

            <View style={styles.modalButtons}>
              <Button
                title="取消"
                onPress={() => setShowEditor(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="添加"
                onPress={handleAddTask}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.md,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textTertiary,
    padding: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 24,
    backgroundColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  taskSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  taskLabel: {
    ...typography.headingLarge,
    color: colors.text,
    textAlign: 'center',
  },
  taskGoal: {
    fontWeight: '400',
    color: colors.primary,
  },
  cardSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  bottomSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingBottom: spacing.xxxl,
    backgroundColor: '#FFFDF0',
  },
  recordButton: {
    marginBottom: spacing.md,
  },
  recordButtonInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D9A406',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  recordButtonActive: {
    backgroundColor: colors.error,
  },
  recordIcon: {
    fontSize: 40,
  },
  recordLabel: {
    ...typography.headingMedium,
    color: colors.text,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    padding: spacing.xl,
  },
  modalTitle: {
    ...typography.headingMedium,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
  },
  lyricsInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
  },
});

export default LearningScreen;
