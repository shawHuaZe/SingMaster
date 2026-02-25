/**
 * Level Service - 关卡服务
 * 处理关卡相关的业务逻辑
 */

import { Level, Chapter } from '../../shared/types';
import { mockChapters } from '../../core/storage/progressStore';

// 关卡数据结构（来自后端）
export interface LevelDTO {
  id: string;
  courseId: string;
  levelNumber: number;
  title: string;
  description: string;
  icon?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  practiceContent?: {
    exerciseText: string;
    exercisePhonetic?: string;
    notes: string[];
    bpm?: number;
    duration?: number;
  };
  target?: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
  };
  detectionMetrics?: {
    metrics: string[];
    pitchAccuracy?: number;
    rhythmStability?: number;
  };
  tips?: string[];
}

// 章节数据结构（来自后端）
export interface ChapterDTO {
  id: string;
  title: string;
  description: string;
  icon?: string;
  islandId?: number;
  unitId?: number;
  levels: LevelDTO[];
}

class LevelService {
  private static instance: LevelService;
  private chapters: Chapter[] = mockChapters;

  private constructor() {}

  static getInstance(): LevelService {
    if (!LevelService.instance) {
      LevelService.instance = new LevelService();
    }
    return LevelService.instance;
  }

  /**
   * 获取所有章节
   */
  async getChapters(): Promise<Chapter[]> {
    // TODO: 调用后端 API
    // const response = await apiClient.get<ChapterDTO[]>('/chapters');
    // return this.mapChaptersFromDTO(response);

    // 当前返回本地数据
    return this.chapters;
  }

  /**
   * 获取单个章节
   */
  async getChapter(chapterId: string): Promise<Chapter | undefined> {
    // TODO: 调用后端 API
    return this.chapters.find((c) => c.id === chapterId);
  }

  /**
   * 获取单个关卡
   */
  async getLevel(levelId: string): Promise<Level | undefined> {
    // TODO: 调用后端 API

    for (const chapter of this.chapters) {
      const level = chapter.levels.find((l) => l.id === levelId);
      if (level) return level;
    }
    return undefined;
  }

  /**
   * 获取关卡的练习内容
   */
  async getLevelPracticeContent(levelId: string): Promise<Level['practiceContent'] | undefined> {
    const level = await this.getLevel(levelId);
    return level?.practiceContent;
  }

  /**
   * 获取关卡的目标分数
   */
  async getLevelTarget(levelId: string): Promise<Level['target'] | undefined> {
    const level = await this.getLevel(levelId);
    return level?.target;
  }

  /**
   * 获取关卡的检测指标
   */
  async getLevelDetectionMetrics(levelId: string): Promise<Level['detectionMetrics'] | undefined> {
    const level = await this.getLevel(levelId);
    return level?.detectionMetrics;
  }

  /**
   * 根据岛屿获取章节
   */
  async getChaptersByIsland(islandId: number): Promise<Chapter[]> {
    return this.chapters.filter((c) => c.islandId === islandId);
  }

  /**
   * 获取岛屿列表信息
   */
  async getIslands(): Promise<{ id: number; name: string; icon: string; chapterCount: number }[]> {
    const islands = [
      { id: 1, name: '新手村', icon: '🟢', description: '零基础康复' },
      { id: 2, name: 'KTV麦霸集训营', icon: '🟡', description: '声音好听化' },
      { id: 3, name: '进阶歌手工坊', icon: '🟠', description: '混声 + 高音' },
      { id: 4, name: '艺术家殿堂', icon: '🔴', description: '风格表达' },
    ];

    return islands.map((island) => ({
      ...island,
      chapterCount: this.chapters.filter((c) => c.islandId === island.id).length,
    }));
  }

  /**
   * 更新关卡进度（星星数）
   */
  async updateLevelStars(levelId: string, stars: number): Promise<void> {
    // TODO: 调用后端 API

    // 本地更新
    this.chapters = this.chapters.map((chapter) => ({
      ...chapter,
      levels: chapter.levels.map((level) => {
        if (level.id === levelId) {
          return {
            ...level,
            stars: Math.max(level.stars || 0, stars),
            isCompleted: true,
          };
        }
        return level;
      }),
    }));
  }

  /**
   * DTO 映射
   */
  private mapChapterFromDTO(dto: ChapterDTO): Chapter {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      icon: dto.icon,
      islandId: dto.islandId,
      unitId: dto.unitId,
      levels: dto.levels.map((levelDto) => this.mapLevelFromDTO(levelDto)),
    };
  }

  private mapLevelFromDTO(dto: LevelDTO): Level {
    return {
      id: dto.id,
      courseId: dto.courseId,
      levelNumber: dto.levelNumber,
      title: dto.title,
      description: dto.description,
      isUnlocked: true,
      isCompleted: false,
      icon: dto.icon,
      difficulty: dto.difficulty,
      practiceContent: dto.practiceContent,
      target: dto.target,
      detectionMetrics: dto.detectionMetrics,
      tips: dto.tips,
    };
  }
}

export const levelService = LevelService.getInstance();
export default levelService;
