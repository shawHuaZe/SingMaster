// Progress Store - Zustand
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, Achievement, Level, Chapter } from '../../shared/types';

const STORAGE_KEYS = {
  PROGRESS: '@singmaster_progress',
};

// Mock data for chapters and levels
export const mockChapters: Chapter[] = [
  {
    id: 'chapter_1',
    title: '发声基础',
    description: '学习正确的呼吸和发声方法',
    levels: [
      { id: 'level_1_1', courseId: 'breathing', levelNumber: 1, title: '腹式呼吸入门', description: '学习腹式呼吸的基本方法', isUnlocked: true, isCompleted: false },
      { id: 'level_1_2', courseId: 'breathing', levelNumber: 2, title: '腹式呼吸进阶', description: '掌握气息控制', isUnlocked: false, isCompleted: false },
      { id: 'level_1_3', courseId: 'breathing', levelNumber: 3, title: '正确姿势', description: '保持正确的歌唱姿势', isUnlocked: false, isCompleted: false },
      { id: 'level_1_4', courseId: 'breathing', levelNumber: 4, title: '基础共鸣', description: '感知共鸣位置', isUnlocked: false, isCompleted: false },
      { id: 'level_1_5', courseId: 'breathing', levelNumber: 5, title: '章节考核', description: '综合练习', isUnlocked: false, isCompleted: false },
    ],
  },
  {
    id: 'chapter_2',
    title: '音准听力',
    description: '培养音高感知和节奏感',
    levels: [
      { id: 'level_2_1', courseId: 'earTraining', levelNumber: 1, title: '音高辨识', description: '辨别高音和低音', isUnlocked: false, isCompleted: false },
      { id: 'level_2_2', courseId: 'earTraining', levelNumber: 2, title: 'C大调音阶', description: '上行音阶练习', isUnlocked: false, isCompleted: false },
      { id: 'level_2_3', courseId: 'earTraining', levelNumber: 3, title: 'C大调音阶', description: '下行音阶练习', isUnlocked: false, isCompleted: false },
      { id: 'level_2_4', courseId: 'earTraining', levelNumber: 4, title: '基础音程', description: '二度、三度音程', isUnlocked: false, isCompleted: false },
      { id: 'level_2_5', courseId: 'earTraining', levelNumber: 5, title: '章节考核', description: '综合练习', isUnlocked: false, isCompleted: false },
    ],
  },
  {
    id: 'chapter_3',
    title: '节奏入门',
    description: '掌握基本节奏',
    levels: [
      { id: 'level_3_1', courseId: 'rhythm', levelNumber: 1, title: '四分音符', description: '均匀拍点练习', isUnlocked: false, isCompleted: false },
      { id: 'level_3_2', courseId: 'rhythm', levelNumber: 2, title: '八分音符', description: '节奏感培养', isUnlocked: false, isCompleted: false },
      { id: 'level_3_3', courseId: 'rhythm', levelNumber: 3, title: '节奏综合', description: '简单节奏型', isUnlocked: false, isCompleted: false },
      { id: 'level_3_4', courseId: 'rhythm', levelNumber: 4, title: '旋律模唱', description: '音高+节奏', isUnlocked: false, isCompleted: false },
      { id: 'level_3_5', courseId: 'rhythm', levelNumber: 5, title: '章节考核', description: '综合练习', isUnlocked: false, isCompleted: false },
    ],
  },
];

const initialProgress: UserProgress = {
  userId: '',
  currentChapter: 0,
  currentLevel: 0,
  completedLessons: [],
  totalPracticeTime: 0,
  streak: 0,
  achievements: [],
};

interface ProgressStore {
  progress: UserProgress;
  chapters: Chapter[];
  isLoading: boolean;

  // Actions
  loadProgress: () => Promise<void>;
  completeLesson: (lessonId: string, score: number) => Promise<void>;
  unlockNextLevel: () => void;
  updateStreak: () => void;
  addPracticeTime: (seconds: number) => void;
  resetProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: initialProgress,
  chapters: mockChapters,
  isLoading: false,

  loadProgress: async () => {
    set({ isLoading: true });
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (data) {
        const progress = JSON.parse(data) as UserProgress;
        set({ progress, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },

  completeLesson: async (lessonId: string, score: number) => {
    const { progress, chapters } = get();

    // Update completed lessons
    const completedLessons = [...progress.completedLessons, lessonId];

    // Update level completion status
    const updatedChapters = chapters.map(chapter => ({
      ...chapter,
      levels: chapter.levels.map(level => {
        if (level.id === lessonId) {
          return {
            ...level,
            isCompleted: true,
            bestScore: Math.max(level.bestScore || 0, score),
          };
        }
        return level;
      }),
    }));

    // Calculate new progress
    const newProgress: UserProgress = {
      ...progress,
      completedLessons,
      totalPracticeTime: progress.totalPracticeTime + 300, // 5 minutes per lesson
    };

    await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));

    set({
      progress: newProgress,
      chapters: updatedChapters,
    });

    // Unlock next level
    get().unlockNextLevel();
  },

  unlockNextLevel: () => {
    const { chapters, progress } = get();

    // Find current chapter and level
    let foundCurrent = false;
    let unlocked = false;

    const updatedChapters = chapters.map((chapter, chapterIndex) => {
      if (chapterIndex < progress.currentChapter) {
        return chapter;
      }

      return {
        ...chapter,
        levels: chapter.levels.map((level, levelIndex) => {
          if (chapterIndex === progress.currentChapter && levelIndex === progress.currentLevel) {
            foundCurrent = true;
            return level;
          }

          if (foundCurrent && !unlocked) {
            unlocked = true;
            return { ...level, isUnlocked: true };
          }

          return level;
        }),
      };
    });

    set({ chapters: updatedChapters });
  },

  updateStreak: () => {
    const { progress } = get();
    const today = new Date().toDateString();
    const lastPractice = progress.lastPracticeDate
      ? new Date(progress.lastPracticeDate).toDateString()
      : null;

    let newStreak = progress.streak;

    if (lastPractice === today) {
      // Already practiced today
      return;
    } else if (lastPractice) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastPractice === yesterday.toDateString()) {
        // Practiced yesterday, increment streak
        newStreak = progress.streak + 1;
      } else {
        // Streak broken, reset
        newStreak = 1;
      }
    } else {
      // First practice
      newStreak = 1;
    }

    const newProgress: UserProgress = {
      ...progress,
      streak: newStreak,
      lastPracticeDate: new Date().toISOString(),
    };

    AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
    set({ progress: newProgress });
  },

  addPracticeTime: (seconds: number) => {
    const { progress } = get();
    const newProgress: UserProgress = {
      ...progress,
      totalPracticeTime: progress.totalPracticeTime + seconds,
    };

    AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(newProgress));
    set({ progress: newProgress });
  },

  resetProgress: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.PROGRESS);
    set({ progress: initialProgress, chapters: mockChapters });
  },
}));

export default useProgressStore;
