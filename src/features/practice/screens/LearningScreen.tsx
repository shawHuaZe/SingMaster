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
  Dimensions,
  PanResponder,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { colors, spacing } from '../../../shared/constants';
import { RootStackParamList } from '../../../app/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LearningScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // State
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentTask, setCurrentTask] = useState<TrainingTask>(defaultTrainingTasks[0]);
  const [aiAvatar] = useState<AIAvatar>(defaultAIAvatar);
  const [isRecording, setIsRecording] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [slideCancel, setSlideCancel] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('你好！我是你的AI歌唱导师。今天我们要学习气口训练。长按麦克风开始录制你的演唱~');

  // Animations
  const recordScaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Editor state (hidden from UI)
  const [showEditor, setShowEditor] = useState(false);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorDesc, setEditorDesc] = useState('');
  const [editorGoal, setEditorGoal] = useState('');
  const [editorLyrics, setEditorLyrics] = useState('');

  const [tasks] = useState<TrainingTask[]>(defaultTrainingTasks);

  // PanResponder for slide to cancel
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsPressing(true);
        setIsRecording(true);
        setCurrentMessage('正在录音...请讲话');

        // Start glow animation
        Animated.parallel([
          Animated.spring(recordScaleAnim, {
            toValue: 1.1,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        // Slide up to cancel (negative dy)
        if (gestureState.dy < -50) {
          setSlideCancel(true);
          // Change glow to red
          Animated.timing(glowAnim, {
            toValue: 2,
            duration: 200,
            useNativeDriver: false,
          }).start();
        } else {
          if (slideCancel) {
            setSlideCancel(false);
            // Restore blue glow
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }).start();
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        setIsPressing(false);

        if (slideCancel || gestureState.dy < -50) {
          // Cancel recording
          setIsRecording(false);
          setCurrentMessage('已取消录音');
          setSlideCancel(false);
        } else {
          // Finish recording
          setIsRecording(false);
          setCurrentMessage('很好！你的气口处理得很不错。继续练习下一句吧！');
        }

        // Reset animations
        Animated.parallel([
          Animated.spring(recordScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]).start();
      },
      onPanResponderTerminate: () => {
        setIsPressing(false);
        setIsRecording(false);
        setSlideCancel(false);
      },
    })
  ).current;

  // Backend function to add task
  const addTaskToSystem = (task: TrainingTask) => {
    console.log('Adding task to system:', task);
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

  // Interpolate glow color
  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['rgba(28, 176, 246, 0)', 'rgba(28, 176, 246, 0.6)', 'rgba(255, 75, 75, 0.6)'],
  });

  const recordButtonBg = slideCancel ? '#FF4B4B' : '#FFC107';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Progress */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* TASK Section - Fixed height */}
        <View style={styles.taskSection}>
          <Text style={styles.taskLabel}>TASK: </Text>
          <Text style={styles.taskGoal} numberOfLines={2}>
            {currentTask.goal}
          </Text>
        </View>

        {/* AI Tutor Bubble */}
        <AITutorBubble
          avatar={aiAvatar}
          message={currentMessage}
        />

        {/* Training Cards - Swipeable */}
        <View style={styles.cardsSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32));
              const safeIndex = Math.max(0, Math.min(index, tasks.length - 1));
              setCurrentTaskIndex(safeIndex);
              setCurrentTask(tasks[safeIndex]);
            }}
            contentContainerStyle={styles.cardsScrollContent}
          >
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskCardWrapper}>
                <TrainingCard task={task} />
              </View>
            ))}
          </ScrollView>

          {/* Dots */}
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
      </ScrollView>

      {/* Bottom Recording Section - Long press with slide to cancel */}
      <View style={styles.bottomSection}>
        {/* Slide up hint */}
        {isRecording && (
          <Text style={styles.cancelHint}>
            {slideCancel ? '松开取消' : '上滑取消'}
          </Text>
        )}

        <View
          style={styles.recordButtonContainer}
          {...panResponder.panHandlers}
        >
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                backgroundColor: glowColor,
                transform: [{ scale: glowAnim.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [1, 1.3, 1.3],
                })}],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.recordButton,
              {
                backgroundColor: recordButtonBg,
                transform: [{ scale: recordScaleAnim }],
              },
            ]}
          >
            {/* Microphone icon using emoji */}
            <Text style={styles.micIcon}>🎤</Text>
          </Animated.View>
        </View>

        <Text style={styles.recordLabel}>
          {isRecording ? (slideCancel ? '取消录音' : '录音中...') : '长按录音'}
        </Text>
      </View>

      {/* Task Editor Modal (Backend) */}
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
    backgroundColor: '#F7F7F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 220,
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
    color: '#999',
    padding: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 24,
    backgroundColor: '#E5E5E5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 12,
  },
  taskSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 80, // Fixed height for 2 lines
  },
  taskLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 1,
  },
  taskGoal: {
    flex: 1,
    fontSize: 20,
    fontWeight: '400',
    color: '#FFC107',
    marginLeft: spacing.sm,
  },
  cardsSection: {
    paddingTop: spacing.md,
  },
  cardsScrollContent: {
    paddingHorizontal: spacing.lg,
  },
  taskCardWrapper: {
    width: SCREEN_WIDTH - 32,
    marginRight: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
  },
  dotActive: {
    backgroundColor: '#FFC107',
    width: 24,
  },
  // Bottom Section
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 64,
    backgroundColor: '#FFFDF0',
  },
  cancelHint: {
    fontSize: 14,
    color: '#FF4B4B',
    fontWeight: '600',
    marginBottom: 12,
  },
  recordButtonContainer: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowEffect: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D9A406',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  micIcon: {
    fontSize: 40,
  },
  recordLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginTop: 24,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    color: '#333',
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
