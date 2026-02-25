// User types
export interface User {
  id: string;
  phone: string;
  nickname: string;
  avatar?: string;
  level: number;
  experience: number;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  levels: Level[];
}

export type CourseCategory =
  | 'breathing'       // 发声基础
  | 'earTraining'     // 音准听力
  | 'technique'       // 技术拓展
  | 'style'           // 风格表现
  | 'creation';       // 创作编曲

// Level types with detailed training content
export interface LevelPracticeContent {
  // 练习内容
  exerciseText: string;          // 练习文本/歌词
  exercisePhonetic?: string;     // 音标/注音
  notes: string[];               // 目标音符
  bpm?: number;                  // 节拍速度
  duration?: number;             // 持续时间(秒)
}

export interface LevelTarget {
  // 等级目标（星级）
  oneStar: number;               // 1星目标
  twoStar: number;              // 2星目标
  threeStar: number;            // 3星目标
}

export interface AIDetectionMetrics {
  // AI检测指标
  metrics: string[];            // 检测指标列表
  pitchAccuracy?: number;       // 音准精度要求
  rhythmStability?: number;     // 节奏稳定性要求
}

export interface Level {
  id: string;
  courseId: string;
  levelNumber: number;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore?: number;
  stars?: number;                // 获得星星数 0-3

  // 扩展字段
  practiceContent?: LevelPracticeContent;
  target?: LevelTarget;
  detectionMetrics?: AIDetectionMetrics;
  tips?: string[];               // 练习提示
  icon?: string;                 // 关卡图标
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  levels: Level[];
  // 扩展字段
  islandId?: number;              // 所属岛屿 1-4
  unitId?: number;               // 单元编号 1-14
  icon?: string;                 // 章节图标
}

// Practice types
export interface PracticeSession {
  id: string;
  levelId: string;
  startTime: string;
  endTime?: string;
  status: PracticeStatus;
  attempts: PracticeAttempt[];
}

export type PracticeStatus =
  | 'notStarted'
  | 'inProgress'
  | 'completed';

export interface PracticeAttempt {
  id: string;
  timestamp: string;
  audioUrl?: string;
  pitchData: PitchData[];
  score?: ScoreResult;
  feedback?: string;
}

// Audio types
export interface PitchData {
  frequency: number;
  note: string;
  octave: number;
  cents: number;
  confidence: number;
  timestamp: number;
}

export interface NoteInfo {
  name: string;
  octave: number;
  frequency: number;
}

export interface AudioEngineConfig {
  sampleRate: number;
  bufferSize: number;
  fftSize: number;
  minFrequency: number;
  maxFrequency: number;
}

// Score types
export interface ScoreResult {
  totalScore: number;
  pitchScore: number;
  rhythmScore: number;
  stabilityScore: number;
  expressionScore?: number;
  grade: Grade;
  feedback: ScoreFeedback[];
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface ScoreFeedback {
  type: 'pitch' | 'rhythm' | 'stability' | 'expression';
  message: string;
  timestamp: number;
  note?: string;
  suggestion?: string;
}

// Achievement types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export type AchievementCategory =
  | 'practice'    // 练习成就
  | 'streak'      // 连续成就
  | 'skill'       // 技能成就
  | 'social';     // 社交成就

// Progress types
export interface UserProgress {
  userId: string;
  currentChapter: number;
  currentLevel: number;
  completedLessons: string[];
  totalPracticeTime: number;
  streak: number;
  lastPracticeDate?: string;
  achievements: Achievement[];
}

// AI Teaching types
export interface AITeachingStep {
  id: string;
  type: AITeachingStepType;
  content: AITeachingContent;
  duration?: number;
}

export type AITeachingStepType =
  | 'demonstrate'    // AI示范
  | 'listen'         // 用户跟唱
  | 'feedback'       // AI反馈
  | 'repeat'         // 再次示范
  | 'complete';      // 完成

export interface AITeachingContent {
  text: string;
  audioUrl?: string;
  targetNote?: string;
  visualGuide?: string;
  suggestions?: string[];
}

export interface AILesson {
  id: string;
  levelId: string;
  steps: AITeachingStep[];
  targetScore: number;
}
