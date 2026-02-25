// Training Task Types
export interface LyricSyllable {
  id: string;
  text: string;
  pitch?: 'up' | 'down' | 'flat' | 'rise' | 'fall';  // 音调起伏
  emphasis?: boolean;  // 重音
  isBreathMark?: boolean;  // 气口（分割线）
}

export interface TrainingTask {
  id: string;
  title: string;           // 训练任务标题
  description: string;     // 任务描述
  goal: string;           // 学习目标
  syllables: LyricSyllable[];  // 歌词音节
}

// AI Avatar
export interface AIAvatar {
  id: string;
  name: string;
  imageUrl: string | ReturnType<typeof require>;
}

// Mock training data
export const defaultTrainingTasks: TrainingTask[] = [
  {
    id: 'task_1',
    title: '气口训练',
    description: '在正确位置换气，保持句子连贯',
    goal: '学习如何在歌词的正确位置换气',
    syllables: [
      { id: 's1', text: '我', pitch: 'flat' },
      { id: 's2', text: '想', pitch: 'rise', emphasis: true },
      { id: 's3', text: '要', pitch: 'flat' },
      { id: 's4', text: '', isBreathMark: true },
      { id: 's5', text: '带', pitch: 'fall', emphasis: true },
      { id: 's6', text: '你', pitch: 'rise' },
      { id: 's7', text: '去', pitch: 'rise' },
      { id: 's8', text: '看', pitch: 'rise', emphasis: true },
      { id: 's9', text: '海', pitch: 'fall' },
    ],
  },
  {
    id: 'task_2',
    title: '音准训练',
    description: '准确的音高控制',
    goal: '提高音准准确度',
    syllables: [
      { id: 's1', text: '啦', pitch: 'flat' },
      { id: 's2', text: '啦', pitch: 'rise' },
      { id: 's3', text: '啦', pitch: 'down', emphasis: true },
    ],
  },
];

// Default AI Avatar
export const defaultAIAvatar: AIAvatar = {
  id: 'avatar_1',
  name: '小音老师',
  imageUrl: require('../../../assets/images/ai_avatar.png'),
};
