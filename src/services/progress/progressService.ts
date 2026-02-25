/**
 * Progress Service - 进度服务
 * 处理学习进度相关的业务逻辑
 */

import { UserProgress, Achievement } from '../../shared/types';
import { useProgressStore } from '../../core/storage/progressStore';

// 进度数据结构（来自后端）
export interface ProgressDTO {
  userId: string;
  currentChapter: number;
  currentLevel: number;
  completedLessons: string[];
  totalPracticeTime: number;
  streak: number;
  lastPracticeDate?: string;
  achievements: AchievementDTO[];
}

// 成就数据结构（来自后端）
export interface AchievementDTO {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// 评分结果
export interface ScoreSubmission {
  levelId: string;
  score: number;
  stars: number;
  pitchScore: number;
  rhythmScore: number;
  stabilityScore: number;
  expressionScore?: number;
}

class ProgressService {
  private static instance: ProgressService;

  private constructor() {}

  static getInstance(): ProgressService {
    if (!ProgressService.instance) {
      ProgressService.instance = new ProgressService();
    }
    return ProgressService.instance;
  }

  /**
   * 获取用户进度
   */
  async getUserProgress(userId: string): Promise<UserProgress> {
    // TODO: 调用后端 API
    const store = useProgressStore.getState();
    return store.progress;
  }

  /**
   * 同步本地进度到服务器
   */
  async syncProgress(progress: UserProgress): Promise<void> {
    // TODO: 调用后端 API
    console.log('同步进度到服务器:', progress);
  }

  /**
   * 完成关卡
   */
  async completeLevel(submission: ScoreSubmission): Promise<{ stars: number; newAchievements: Achievement[] }> {
    // TODO: 调用后端 API
    const store = useProgressStore.getState();

    // 计算星星数
    const level = await this.getLevel(submission.levelId);
    let stars = 0;
    if (level?.target) {
      if (submission.score >= level.target.threeStar) {
        stars = 3;
      } else if (submission.score >= level.target.twoStar) {
        stars = 2;
      } else if (submission.score >= level.target.oneStar) {
        stars = 1;
      }
    }

    // 更新本地进度
    await store.completeLesson(submission.levelId, submission.score);

    // 检查新成就
    const newAchievements = this.checkAchievements(store.progress);

    return { stars, newAchievements };
  }

  /**
   * 获取单个关卡信息
   */
  private async getLevel(levelId: string) {
    const store = useProgressStore.getState();
    for (const chapter of store.chapters) {
      const level = chapter.levels.find((l) => l.id === levelId);
      if (level) return level;
    }
    return undefined;
  }

  /**
   * 检查成就解锁
   */
  private checkAchievements(progress: UserProgress): Achievement[] {
    const achievements: Achievement[] = [];
    const completedCount = progress.completedLessons.length;
    const streak = progress.streak;

    // 练习成就
    if (completedCount >= 1 && !progress.achievements.find((a) => a.id === 'first_lesson')) {
      achievements.push({
        id: 'first_lesson',
        title: '初学者',
        description: '完成第一个关卡',
        icon: '🎯',
        unlockedAt: new Date().toISOString(),
      });
    }

    if (completedCount >= 10 && !progress.achievements.find((a) => a.id === 'ten_lessons')) {
      achievements.push({
        id: 'ten_lessons',
        title: '小试牛刀',
        description: '完成10个关卡',
        icon: '🌟',
        unlockedAt: new Date().toISOString(),
      });
    }

    if (completedCount >= 30 && !progress.achievements.find((a) => a.id === 'thirty_lessons')) {
      achievements.push({
        id: 'thirty_lessons',
        title: '歌唱达人',
        description: '完成30个关卡',
        icon: '🏆',
        unlockedAt: new Date().toISOString(),
      });
    }

    // 连续成就
    if (streak >= 3 && !progress.achievements.find((a) => a.id === 'streak_3')) {
      achievements.push({
        id: 'streak_3',
        title: '三天打鱼',
        description: '连续练习3天',
        icon: '🔥',
        unlockedAt: new Date().toISOString(),
      });
    }

    if (streak >= 7 && !progress.achievements.find((a) => a.id === 'streak_7')) {
      achievements.push({
        id: 'streak_7',
        title: '一周坚持',
        description: '连续练习7天',
        icon: '💪',
        unlockedAt: new Date().toISOString(),
      });
    }

    if (streak >= 30 && !progress.achievements.find((a) => a.id === 'streak_30')) {
      achievements.push({
        id: 'streak_30',
        title: '歌唱大师',
        description: '连续练习30天',
        icon: '👑',
        unlockedAt: new Date().toISOString(),
      });
    }

    return achievements;
  }

  /**
   * 获取成就列表
   */
  async getAchievements(userId: string): Promise<Achievement[]> {
    // TODO: 调用后端 API
    const store = useProgressStore.getState();
    return store.progress.achievements;
  }

  /**
   * 更新连续天数
   */
  async updateStreak(): Promise<number> {
    const store = useProgressStore.getState();
    store.updateStreak();
    return store.progress.streak;
  }

  /**
   * 添加练习时间
   */
  async addPracticeTime(seconds: number): Promise<void> {
    const store = useProgressStore.getState();
    store.addPracticeTime(seconds);
  }

  /**
   * 重置进度
   */
  async resetProgress(): Promise<void> {
    const store = useProgressStore.getState();
    await store.resetProgress();
  }

  /**
   * 获取今日进度
   */
  async getTodayProgress(): Promise<{ completed: number; target: number; percentage: number }> {
    const store = useProgressStore.getState();
    const completed = store.progress.completedLessons.length % 5;
    const target = 5;
    return {
      completed,
      target,
      percentage: (completed / target) * 100,
    };
  }

  /**
   * DTO 映射
   */
  private mapProgressFromDTO(dto: ProgressDTO): UserProgress {
    return {
      userId: dto.userId,
      currentChapter: dto.currentChapter,
      currentLevel: dto.currentLevel,
      completedLessons: dto.completedLessons,
      totalPracticeTime: dto.totalPracticeTime,
      streak: dto.streak,
      lastPracticeDate: dto.lastPracticeDate,
      achievements: dto.achievements.map((a) => this.mapAchievementFromDTO(a)),
    };
  }

  private mapAchievementFromDTO(dto: AchievementDTO): Achievement {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      icon: dto.icon,
      unlockedAt: dto.unlockedAt,
      progress: dto.progress,
      target: dto.target,
    };
  }
}

export const progressService = ProgressService.getInstance();
export default progressService;
