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
import { MaterialIcons } from '@expo/vector-icons';
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
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  // Animations
  const recordScaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollXRef = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

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
          // Finish recording - auto slide to next card
          setIsRecording(false);
          setCurrentMessage('很好！你的气口处理得很不错。继续练习下一句吧！');

          // Increment completed tasks count
          setCompletedTasksCount(prev => prev + 1);

          // Auto slide to next card if not at the last task
          if (currentTaskIndex < tasks.length - 1) {
            setTimeout(() => {
              const nextIndex = currentTaskIndex + 1;
              setCurrentTaskIndex(nextIndex);
              setCurrentTask(tasks[nextIndex]);
              setCanScrollRight(true);
              // Scroll to next card
              scrollViewRef.current?.scrollTo({
                x: nextIndex * (SCREEN_WIDTH - 32),
                animated: true,
              });
            }, 500);
          }
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

  // PanResponder for card swipe - only allow swipe left to go back
  const cardPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow swipe left (negative dx) to go back
        if (gestureState.dx < -30 && currentTaskIndex > 0) {
          // Swipe left - can go back
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Swipe left to go back to previous card
        if (gestureState.dx < -50 && currentTaskIndex > 0) {
          const prevIndex = currentTaskIndex - 1;
          setCurrentTaskIndex(prevIndex);
          setCurrentTask(tasks[prevIndex]);
          scrollViewRef.current?.scrollTo({
            x: prevIndex * (SCREEN_WIDTH - 32),
            animated: true,
          });
        }
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

  // Dynamic progress based on task completion - start at 0%, advance by 1/n for each completed task
  const progressPercent = tasks.length > 0
    ? (completedTasksCount / tasks.length) * 100
    : 0;

  // Animate progress bar when completed tasks count changes
  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [completedTasksCount]);

  // Interpolate glow color and opacity
  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['rgba(28, 176, 246, 0)', 'rgba(28, 176, 246, 0.4)', 'rgba(255, 75, 75, 0.4)'],
  });

  // Spreading aura scale
  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const recordButtonBg = slideCancel ? '#FF4B4B' : '#FFC107';

  // Start spreading glow animation when recording
  React.useEffect(() => {
    if (isRecording && !slideCancel) {
      // Start pulsing animation
      const pulsingAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      pulsingAnim.start();
      return () => pulsingAnim.stop();
    }
  }, [isRecording, slideCancel]);

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
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            >
              {/* Highlight effect - only on yellow portion */}
              <View style={styles.progressHighlight} />
            </Animated.View>
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

        {/* Training Cards - Auto slide after completion, only swipe left to return */}
        <View style={styles.cardsSection} {...cardPanResponder.panHandlers}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false} // Disable manual scroll - only programmatic
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
          {/* Glow effect - spreading aura */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                backgroundColor: glowColor,
                transform: [{ scale: glowScale }],
                opacity: isRecording ? 1 : 0,
              },
            ]}
          />
          {/* Border ring effect */}
          <Animated.View
            style={[
              styles.glowRing,
              {
                borderColor: slideCancel ? 'rgba(255, 75, 75, 0.3)' : 'rgba(255, 193, 7, 0.3)',
                transform: [{ scale: glowScale }],
                opacity: isRecording ? 1 : 0,
              },
            ]}
          />

          {/* Three-layer nested View for two-layer shadow (iOS + Android compatible) */}
          <View style={styles.shadowBlurContainer}>
            <View style={styles.shadowSolidContainer}>
              <Animated.View
                style={[
                  styles.recordButton,
                  {
                    backgroundColor: recordButtonBg,
                    transform: [{ scale: recordScaleAnim }],
                  },
                ]}
              >
                {/* Microphone icon using Material Icons */}
                <MaterialIcons name="mic" size={40} color="#111827" />
              </Animated.View>
            </View>
          </View>
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
    paddingTop: spacing.xl + 12, // More space from status bar
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
    // Simulate inset shadow at bottom edge - using border
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 12,
    // Simulate inset shadow at bottom edge
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  // Progress bar highlight overlay - inside yellow area
  progressHighlight: {
    position: 'absolute',
    top: 4,
    left: 8,
    right: 8,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
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
  glowRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
  },
  // Layer 1: Outer container - blur shadow (0 15px 30px rgba(255, 193, 7, 0.3))
  // Using hex with alpha: #FFC10780 = #FFC107 + 50% opacity
  shadowBlurContainer: {
    shadowColor: '#FFC10780',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 0,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Layer 2: Middle container - solid shadow (0 8px 0 #D9A406)
  shadowSolidContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#D9A406',
    marginBottom: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Layer 3: Button body
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFC107',
    transform: [{ translateY: -8 }],
    alignItems: 'center',
    justifyContent: 'center',
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
