// Practice Store - Zustand
import { create } from 'zustand';
import { PracticeSession, PitchData, ScoreResult, AITeachingStep, AILesson } from '../../shared/types';

interface PracticeStore {
  // Current session
  currentSession: PracticeSession | null;
  isRecording: boolean;
  realTimePitch: PitchData | null;
  targetNote: string | null;

  // AI Teaching
  currentLesson: AILesson | null;
  currentStepIndex: number;
  isPlayingDemo: boolean;
  isWaitingForUser: boolean;

  // Actions
  startSession: (levelId: string) => void;
  setTargetNote: (note: string) => void;
  updatePitch: (data: PitchData) => void;
  endSession: () => Promise<ScoreResult | null>;

  // AI Teaching actions
  startLesson: (lesson: AILesson) => void;
  nextStep: () => void;
  setPlayingDemo: (playing: boolean) => void;
  setWaitingForUser: (waiting: boolean) => void;
  completeLesson: () => Promise<void>;
}

// Mock AI Lesson data
export const mockAILessons: Record<string, AILesson> = {
  'level_1_1': {
    id: 'lesson_1_1',
    levelId: 'level_1_1',
    targetScore: 60,
    steps: [
      {
        id: 'step_1',
        type: 'demonstrate',
        content: {
          text: '你好！我是你的AI歌唱导师。今天我们要学习腹式呼吸。跟我一起做：首先放松肩膀，慢慢吸气，让空气沉到腹部。',
          audioUrl: 'demo_breathing_1',
        },
        duration: 5000,
      },
      {
        id: 'step_2',
        type: 'listen',
        content: {
          text: '现在轮到你 了。放松肩膀，慢慢吸气，感受空气沉到腹部。准备好了吗？',
          targetNote: 'breath_in',
        },
      },
      {
        id: 'step_3',
        type: 'feedback',
        content: {
          text: '我听到你吸气的声音了！记得要缓慢而深沉，让横膈膜向下移动。',
          suggestions: ['试着让吸气更慢一些', '感受腹部的膨胀'],
        },
      },
      {
        id: 'step_4',
        type: 'repeat',
        content: {
          text: '很好！让我们再练习一次。吸气时想象腹部像气球一样慢慢膨胀...',
          audioUrl: 'demo_breathing_2',
        },
        duration: 4000,
      },
      {
        id: 'step_5',
        type: 'complete',
        content: {
          text: '太棒了！你已经掌握了腹式呼吸的基本要领。继续加油！',
        },
      },
    ],
  },
  'level_2_1': {
    id: 'lesson_2_1',
    levelId: 'level_2_1',
    targetScore: 60,
    steps: [
      {
        id: 'step_1',
        type: 'demonstrate',
        content: {
          text: '欢迎来到音准训练！我们先来学习辨别高音和低音。跟我一起听：这是低音...',
          audioUrl: 'demo_low_note',
        },
        duration: 3000,
      },
      {
        id: 'step_2',
        type: 'listen',
        content: {
          text: '这是高音...现在轮到你来判断。哪个更高？',
          targetNote: 'C4',
        },
      },
      {
        id: 'step_3',
        type: 'feedback',
        content: {
          text: '判断得很准确！高音通常更尖锐明亮，低音更低沉浑厚。',
        },
      },
      {
        id: 'step_4',
        type: 'complete',
        content: {
          text: '很好！我们继续练习更多的音高辨识。',
        },
      },
    ],
  },
};

export const usePracticeStore = create<PracticeStore>((set, get) => ({
  currentSession: null,
  isRecording: false,
  realTimePitch: null,
  targetNote: null,
  currentLesson: null,
  currentStepIndex: 0,
  isPlayingDemo: false,
  isWaitingForUser: false,

  startSession: (levelId: string) => {
    const session: PracticeSession = {
      id: 'session_' + Date.now(),
      levelId,
      startTime: new Date().toISOString(),
      status: 'inProgress',
      attempts: [],
    };

    // Load AI lesson for this level
    const lesson = mockAILessons[levelId] || null;

    set({
      currentSession: session,
      currentLesson: lesson,
      currentStepIndex: 0,
      isRecording: false,
      realTimePitch: null,
    });
  },

  setTargetNote: (note: string) => {
    set({ targetNote: note });
  },

  updatePitch: (data: PitchData) => {
    set({ realTimePitch: data });
  },

  endSession: async () => {
    const { currentSession } = get();

    if (!currentSession) return null;

    // Calculate score (mock)
    const score: ScoreResult = {
      totalScore: 75,
      pitchScore: 80,
      rhythmScore: 70,
      stabilityScore: 75,
      grade: 'B',
      feedback: [
        {
          type: 'pitch',
          message: '音准整体不错，继续保持！',
          timestamp: Date.now(),
        },
      ],
    };

    set({
      currentSession: {
        ...currentSession,
        status: 'completed',
        endTime: new Date().toISOString(),
        attempts: [
          ...currentSession.attempts,
          {
            id: 'attempt_' + Date.now(),
            timestamp: new Date().toISOString(),
            pitchData: [],
            score,
          },
        ],
      },
    });

    return score;
  },

  // AI Teaching actions
  startLesson: (lesson: AILesson) => {
    set({
      currentLesson: lesson,
      currentStepIndex: 0,
      isPlayingDemo: false,
      isWaitingForUser: false,
    });
  },

  nextStep: () => {
    const { currentLesson, currentStepIndex } = get();
    if (!currentLesson) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < currentLesson.steps.length) {
      set({ currentStepIndex: nextIndex });

      // Handle step type
      const nextStep = currentLesson.steps[nextIndex];
      if (nextStep.type === 'listen') {
        set({ isWaitingForUser: true, isRecording: true });
      } else if (nextStep.type === 'demonstrate' || nextStep.type === 'repeat') {
        set({ isPlayingDemo: true });
      }
    }
  },

  setPlayingDemo: (playing: boolean) => {
    set({ isPlayingDemo: playing });
  },

  setWaitingForUser: (waiting: boolean) => {
    set({ isWaitingForUser: waiting, isRecording: waiting });
  },

  completeLesson: async () => {
    set({
      currentSession: null,
      currentLesson: null,
      currentStepIndex: 0,
      isRecording: false,
      isPlayingDemo: false,
      isWaitingForUser: false,
      realTimePitch: null,
    });
  },
}));

export default usePracticeStore;
