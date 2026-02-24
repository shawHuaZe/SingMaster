// Learning Screen - Main Practice Interface
import React, { useState, useRef } from 'react';
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
  FlatList,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LearningScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { completeLesson: saveProgress } = useProgressStore();

  // State
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentTask, setCurrentTask] = useState<TrainingTask>(defaultTrainingTasks[0]);
  const [aiAvatar] = useState<AIAvatar>(defaultAIAvatar);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingAnim] = useState(new Animated.Value(1));
  const [currentMessage, setCurrentMessage] = useState('你好！我是你的AI歌唱导师。今天我们要学习气口训练。点击麦克风开始录制你的演唱~');

  // Editor state (hidden from UI)
  const [showEditor, setShowEditor] = useState(false);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorDesc, setEditorDesc] = useState('');
  const [editorGoal, setEditorGoal] = useState('');
  const [editorLyrics, setEditorLyrics] = useState('');

  // Swipe state
  const scrollViewRef = useRef<ScrollView>(null);
  const [tasks] = useState<TrainingTask[]>(defaultTrainingTasks);

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
      setTimeout(() => {
        setCurrentMessage('很好！你的气口处理得很不错。继续练习下一句吧！');
      }, 1000);
    }
  };

  const handleNextTask = () => {
    const nextIndex = (currentTaskIndex + 1) % tasks.length;
    setCurrentTaskIndex(nextIndex);
    setCurrentTask(tasks[nextIndex]);
    setCurrentMessage(`很好！现在我们来练习：${tasks[nextIndex].goal}`);
  };

  const handlePrevTask = () => {
    const prevIndex = (currentTaskIndex - 1 + tasks.length) % tasks.length;
    setCurrentTaskIndex(prevIndex);
    setCurrentTask(tasks[prevIndex]);
    setCurrentMessage(`好的，我们回到：${tasks[prevIndex].goal}`);
  };

  // Backend function to add task (not exposed in UI)
  const addTaskToSystem = (task: TrainingTask) => {
    // This would save to backend/storage in real app
    console.log('Adding task to system:', task);
  };

  // Trigger editor (for admin use - can be called programmatically)
  const triggerEditor = () => {
    setShowEditor(true);
  };

  const handleAddTask = () => {
    if (!editorTitle || !editorLyrics) return;

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

    addTaskToSystem(newTask);
    setShowEditor(false);
    setEditorTitle('');
    setEditorDesc('');
    setEditorGoal('');
    setEditorLyrics('');
  };

  const progressPercent = 75;

  const renderTaskCard = ({ item, index }: { item: TrainingTask; index: number }) => (
    <View style={styles.taskCardWrapper}>
      <TrainingCard task={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentTaskIndex(index);
          setCurrentTask(tasks[index]);
        }}
      >
        {tasks.map((task, index) => (
          <View key={task.id} style={styles.taskCardWrapper}>
            <TrainingCard task={task} />
          </View>
        ))}
      </ScrollView>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header with Progress */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* TASK Section - Bold */}
        <View style={styles.taskSection}>
          <Text style={styles.taskLabel}>
            <Text style={styles.taskLabelBold}>TASK: </Text>
            <Text style={styles.taskGoal}>{currentTask.goal}</Text>
          </Text>
        </View>

        {/* AI Tutor Bubble */}
        <AITutorBubble
          avatar={aiAvatar}
          message={currentMessage}
        />

        {/* Task Navigation Dots */}
        <View style={styles.dotsContainer}>
          {tasks.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentTaskIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Recording Section - Matching HTML style */}
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

      {/* Task Editor Modal (Backend - not visible in normal UI) */}
      <Modal visible={showEditor} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加训练任务（后台）</Text>

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
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    bottom: 0,
    height: 350,
  },
  taskCardWrapper: {
    width: SCREEN_WIDTH - 32,
    marginHorizontal: 16,
  },
  mainContent: {
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
    fontSize: 20,
    color: colors.text,
    textAlign: 'center',
  },
  taskLabelBold: {
    fontWeight: '800',
    color: colors.text,
  },
  taskGoal: {
    fontWeight: '400',
    color: colors.primary,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
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
    fontSize: 20,
    fontWeight: '800',
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
    fontSize: 18,
    fontWeight: '600',
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
