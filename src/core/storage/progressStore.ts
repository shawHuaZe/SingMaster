// Progress Store - Zustand
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, Achievement, Level, Chapter } from '../../shared/types';

const STORAGE_KEYS = {
  PROGRESS: '@singmaster_progress',
};

// Mock data for chapters and levels - Based on 关卡设计.md
export const mockChapters: Chapter[] = [
  // ============ 岛屿一：新手村（零基础康复）============
  // 单元1：呼吸健身房
  {
    id: 'chapter_1_1',
    title: '呼吸健身房',
    description: '学习稳定气息输出',
    icon: '💨',
    islandId: 1,
    unitId: 1,
    levels: [
      {
        id: 'level_1_1_1',
        courseId: 'breathing',
        levelNumber: 1,
        title: '嘶嘶蛇',
        description: '稳定气息输出练习',
        isUnlocked: true,
        isCompleted: false,
        icon: '🐍',
        difficulty: 'easy',
        practiceContent: {
          exerciseText: 'ssssssss',
          exercisePhonetic: '西～',
          notes: [],
          duration: 10,
        },
        target: { oneStar: 5, twoStar: 8, threeStar: 10 },
        detectionMetrics: { metrics: ['气流持续时间', '音量波动'], pitchAccuracy: 15 },
        tips: ['深吸气2秒', '保持气流均匀', '腹部发力'],
      },
      {
        id: 'level_1_1_2',
        courseId: 'breathing',
        levelNumber: 2,
        title: '吹灭生日蜡烛',
        description: '横膈膜爆发力训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '🕯️',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'P！P！P！P！',
          exercisePhonetic: '破～',
          notes: [],
          bpm: 60,
        },
        target: { oneStar: 4, twoStar: 6, threeStar: 8 },
        detectionMetrics: { metrics: ['气压峰值', '间隔稳定性'] },
        tips: ['短促呼气', '感受腹肌发力', '保持节奏稳定'],
      },
      {
        id: 'level_1_1_3',
        courseId: 'breathing',
        levelNumber: 3,
        title: '闻花香',
        description: '正确吸气姿势练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '🌸',
        difficulty: 'easy',
        practiceContent: {
          exerciseText: '吸—停—呼',
          exercisePhonetic: '吸～呼～',
          notes: [],
        },
        target: { oneStar: 3, twoStar: 5, threeStar: 8 },
        detectionMetrics: { metrics: ['肩膀位移', '胸腔扩张'] },
        tips: ['想象闻花香', '肩膀放松', '缓慢吸气'],
      },
      {
        id: 'level_1_1_4',
        courseId: 'breathing',
        levelNumber: 4,
        title: '节奏呼吸',
        description: '呼吸节奏训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '🎵',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: '吸2 停2 呼4',
          exercisePhonetic: '吸～停～呼～',
          notes: [],
          bpm: 60,
        },
        target: { oneStar: 1, twoStar: 2, threeStar: 3 },
        detectionMetrics: { metrics: ['节奏准确性', '气息持续性'] },
        tips: ['跟随节拍', '感受气息流动', '保持放松'],
      },
    ],
  },
  // 单元2：声带热身操
  {
    id: 'chapter_1_2',
    title: '声带热身操',
    description: '声带预热和热身',
    icon: '🎤',
    islandId: 1,
    unitId: 2,
    levels: [
      {
        id: 'level_1_2_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '唇颤音',
        description: '声带振动热身',
        isUnlocked: false,
        isCompleted: false,
        icon: '👄',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Brrrrrrrr',
          exercisePhonetic: '普～',
          notes: ['Do', 'Re', 'Mi', 'Re', 'Do'],
          bpm: 80,
        },
        target: { oneStar: 10, twoStar: 15, threeStar: 20 },
        detectionMetrics: { metrics: ['振动连续性', '气流均匀度'] },
        tips: ['放松嘴唇', '均匀呼气', '感受振动'],
      },
      {
        id: 'level_1_2_2',
        courseId: 'technique',
        levelNumber: 2,
        title: '警报大作战',
        description: '滑音练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '🚨',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Woo~~~~~',
          exercisePhonetic: '鸣～',
          notes: ['C3', 'C4', 'C5'],
        },
        target: { oneStar: 3, twoStar: 5, threeStar: 8 },
        detectionMetrics: { metrics: ['滑音连贯性', '音高准确性'] },
        tips: ['从低到高', '感受声带拉伸', '保持气息支持'],
      },
      {
        id: 'level_1_2_3',
        courseId: 'technique',
        levelNumber: 3,
        title: '叹气下楼梯',
        description: '放松喉咙练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '😮‍💨',
        difficulty: 'easy',
        practiceContent: {
          exerciseText: 'Ah~~~~',
          exercisePhonetic: '啊～',
          notes: ['Sol', 'Fa', 'Mi', 'Re', 'Do'],
        },
        target: { oneStar: 5, twoStar: 8, threeStar: 12 },
        detectionMetrics: { metrics: ['喉咙放松度', '音高稳定性'] },
        tips: ['像叹气一样', '感受声音下落', '保持喉咙打开'],
      },
    ],
  },
  // 单元3：音准捕手
  {
    id: 'chapter_1_3',
    title: '音准捕手',
    description: '建立音高地图',
    icon: '🎯',
    islandId: 1,
    unitId: 3,
    levels: [
      {
        id: 'level_1_3_1',
        courseId: 'earTraining',
        levelNumber: 1,
        title: '单音打靶',
        description: '基础音高辨识',
        isUnlocked: false,
        isCompleted: false,
        icon: '🎵',
        difficulty: 'easy',
        practiceContent: {
          exerciseText: 'Do Re Mi Fa Sol',
          exercisePhonetic: '都 来 米 发 搜',
          notes: ['Do', 'Re', 'Mi', 'Fa', 'Sol'],
          bpm: 60,
        },
        target: { oneStar: 60, twoStar: 80, threeStar: 90 },
        detectionMetrics: { metrics: ['音高偏差', '起音时间'], pitchAccuracy: 50 },
        tips: ['仔细听AI示范', '放松跟唱', '感受音高变化'],
      },
      {
        id: 'level_1_3_2',
        courseId: 'earTraining',
        levelNumber: 2,
        title: '两音台阶',
        description: '二度三度音程',
        isUnlocked: false,
        isCompleted: false,
        icon: '🪜',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Do Re Do',
          exercisePhonetic: '都~来~都',
          notes: ['Do', 'Re', 'Do'],
          bpm: 70,
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 85 },
        detectionMetrics: { metrics: ['音程准确性', '节奏稳定性'], pitchAccuracy: 40 },
        tips: ['感受音高起伏', '保持节奏稳定'],
      },
      {
        id: 'level_1_3_3',
        courseId: 'earTraining',
        levelNumber: 3,
        title: '三度跳跃',
        description: '三度音程练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '三级跳',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Do Mi Do',
          exercisePhonetic: '都~米~都',
          notes: ['Do', 'Mi', 'Do'],
          bpm: 70,
        },
        target: { oneStar: 55, twoStar: 70, threeStar: 80 },
        detectionMetrics: { metrics: ['音高跨度', '准确性'] },
        tips: ['小星星改编', '大胆跳跃', '保持音准'],
      },
    ],
  },
  // 单元4：咬字与节奏
  {
    id: 'chapter_1_4',
    title: '咬字与节奏',
    description: '元音和节奏训练',
    icon: '📢',
    islandId: 1,
    unitId: 4,
    levels: [
      {
        id: 'level_1_4_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '元音五连鞭',
        description: 'A E I O U 元音练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '✋',
        difficulty: 'easy',
        practiceContent: {
          exerciseText: 'A E I O U',
          exercisePhonetic: '啊 诶 咿 喔 呜',
          notes: [],
          bpm: 80,
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 85 },
        detectionMetrics: { metrics: ['共振稳定性', '元音清晰度'] },
        tips: ['每个元音饱满', '保持口型', '气息支持'],
      },
      {
        id: 'level_1_4_2',
        courseId: 'rhythm',
        levelNumber: 2,
        title: '节拍器拍手',
        description: '节奏感知训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '👏',
        difficulty: 'easy',
        practiceContent: {
          exerciseText: '拍—停—拍—停',
          exercisePhonetic: '拍 停 拍 停',
          notes: [],
          bpm: 80,
        },
        target: { oneStar: 70, twoStar: 85, threeStar: 95 },
        detectionMetrics: { metrics: ['节奏准确性', '间隔稳定性'], rhythmStability: 20 },
        tips: ['跟随节拍', '动作均匀', '保持专注'],
      },
    ],
  },

  // ============ 岛屿二：KTV麦霸集训营 ============
  // 单元5：胸声
  {
    id: 'chapter_2_1',
    title: '胸声',
    description: '声音好听化 - 胸腔共鸣',
    icon: '🦍',
    islandId: 2,
    unitId: 5,
    levels: [
      {
        id: 'level_2_1_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '大猩猩',
        description: '胸声低音区训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '🦍',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Ha Ha Ha',
          exercisePhonetic: '哈 哈 哈',
          notes: ['C2', 'C3'],
        },
        target: { oneStar: 50, twoStar: 70, threeStar: 85 },
        detectionMetrics: { metrics: ['胸腔共鸣', '低音稳定性'] },
        tips: ['声音下沉', '感受胸腔震动', '放松喉咙'],
      },
      {
        id: 'level_2_1_2',
        courseId: 'technique',
        levelNumber: 2,
        title: '播音员腔',
        description: '朗读转歌唱',
        isUnlocked: false,
        isCompleted: false,
        icon: '📰',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: '今天的天气非常好',
          exercisePhonetic: '今天~天气~非常好~',
          notes: [],
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 85 },
        detectionMetrics: { metrics: ['流畅度', '音准稳定性'] },
        tips: ['先朗读再歌唱', '保持自然', '感受胸声'],
      },
      {
        id: 'level_2_1_3',
        courseId: 'technique',
        levelNumber: 3,
        title: '低音下潜',
        description: '拓展低音域',
        isUnlocked: false,
        isCompleted: false,
        icon: '⬇️',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Sol Fa Mi Re Do',
          exercisePhonetic: '搜 发 米 来 都',
          notes: ['Sol', 'Fa', 'Mi', 'Re', 'Do'],
        },
        target: { oneStar: 50, twoStar: 65, threeStar: 80 },
        detectionMetrics: { metrics: ['低音深度', '音准准确性'] },
        tips: ['气息下沉', '感受低音', '循序渐进'],
      },
    ],
  },
  // 单元6：头声
  {
    id: 'chapter_2_2',
    title: '头声',
    description: '头腔共鸣训练',
    icon: '🦉',
    islandId: 2,
    unitId: 6,
    levels: [
      {
        id: 'level_2_2_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '猫头鹰',
        description: '头声练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '🦉',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Hoo Hoo',
          exercisePhonetic: '呼 呼',
          notes: ['C4', 'C5'],
        },
        target: { oneStar: 55, twoStar: 70, threeStar: 85 },
        detectionMetrics: { metrics: ['头腔共鸣', '高音稳定性'] },
        tips: ['声音向上', '感受头腔', '放松下巴'],
      },
      {
        id: 'level_2_2_2',
        courseId: 'technique',
        levelNumber: 2,
        title: '米老鼠',
        description: '说话转歌唱',
        isUnlocked: false,
        isCompleted: false,
        icon: '🐭',
        difficulty: 'easy',
        practiceContent: {
          exerciseText: '你好呀～我爱唱歌～',
          exercisePhonetic: '你好~呀~爱唱歌~',
          notes: [],
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 85 },
        detectionMetrics: { metrics: ['连贯性', '音准准确性'] },
        tips: ['像说话一样自然', '保持头声', '感受高位置'],
      },
      {
        id: 'level_2_2_3',
        courseId: 'technique',
        levelNumber: 3,
        title: '真假音切换',
        description: '混声入门',
        isUnlocked: false,
        isCompleted: false,
        icon: '🔄',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'No—Woo—No—Woo',
          exercisePhonetic: '诺~呜~诺~呜',
          notes: ['C4', 'C5'],
        },
        target: { oneStar: 45, twoStar: 60, threeStar: 75 },
        detectionMetrics: { metrics: ['换声平滑度', '气息支持'] },
        tips: ['感受换声点', '保持气息', '逐步过渡'],
      },
    ],
  },
  // 单元7：气息马拉松
  {
    id: 'chapter_2_3',
    title: '气息马拉松',
    description: '气息控制进阶',
    icon: '🏃',
    islandId: 2,
    unitId: 7,
    levels: [
      {
        id: 'level_2_3_1',
        courseId: 'breathing',
        levelNumber: 1,
        title: '渐强渐弱',
        description: '音量控制训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '📈',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Ah~~~~',
          exercisePhonetic: '啊～',
          notes: [],
          duration: 10,
        },
        target: { oneStar: 50, twoStar: 70, threeStar: 85 },
        detectionMetrics: { metrics: ['波形平滑度', '音量变化'] },
        tips: ['pp→ff→pp', '气息渐变', '保持音高'],
      },
      {
        id: 'level_2_3_2',
        courseId: 'breathing',
        levelNumber: 2,
        title: '断音连击',
        description: '节奏断音训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '⚡',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Ha Ha Ha Ha',
          exercisePhonetic: '哈 哈 哈 哈',
          notes: [],
          bpm: 120,
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 90 },
        detectionMetrics: { metrics: ['节奏准确性', '断音清晰度'] },
        tips: ['快速腹肌收缩', '保持节奏', '每个断音清晰'],
      },
    ],
  },
  // 单元8：流行歌应用
  {
    id: 'chapter_2_4',
    title: '流行歌应用',
    description: '实际歌曲练习',
    icon: '🎤',
    islandId: 2,
    unitId: 8,
    levels: [
      {
        id: 'level_2_4_1',
        courseId: 'style',
        levelNumber: 1,
        title: '乐句模仿',
        description: '流行歌曲乐句',
        isUnlocked: false,
        isCompleted: false,
        icon: '🎼',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: '故事的小黄花',
          exercisePhonetic: '故事~的小~黄花~',
          notes: [],
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 85 },
        detectionMetrics: { metrics: ['乐句连贯', '情感表达'] },
        tips: ['《晴天》选段', '感受句子', '自然表达'],
      },
      {
        id: 'level_2_4_2',
        courseId: 'style',
        levelNumber: 2,
        title: '长尾音',
        description: '气息支撑训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '🌊',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: '爱~~~~~',
          exercisePhonetic: '爱～',
          notes: [],
          duration: 8,
        },
        target: { oneStar: 50, twoStar: 70, threeStar: 85 },
        detectionMetrics: { metrics: ['气息持续', '音高稳定'] },
        tips: ['《起风了》副歌', '均匀气息', '保持位置'],
      },
    ],
  },

  // ============ 岛屿三：进阶歌手工坊 ============
  // 单元9：混声实验室
  {
    id: 'chapter_3_1',
    title: '混声实验室',
    description: '混声技术突破',
    icon: '🔬',
    islandId: 3,
    unitId: 9,
    levels: [
      {
        id: 'level_3_1_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '婴儿哭',
        description: '声带闭合练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '👶',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Nae~~~~',
          exercisePhonetic: '内～',
          notes: [],
        },
        target: { oneStar: 50, twoStar: 65, threeStar: 80 },
        detectionMetrics: { metrics: ['声带闭合', '气息控制'] },
        tips: ['感受声带靠拢', '像婴儿哭', '轻柔开始'],
      },
      {
        id: 'level_3_1_2',
        courseId: 'technique',
        levelNumber: 2,
        title: 'Nai Nai',
        description: '混声音阶练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '🧬',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Nai Nai Nai',
          exercisePhonetic: '奈 奈 奈',
          notes: ['Do', 'Re', 'Mi', 'Fa', 'Sol'],
          bpm: 70,
        },
        target: { oneStar: 50, twoStar: 65, threeStar: 80 },
        detectionMetrics: { metrics: ['混声过渡', '音准准确性'] },
        tips: ['感受真假混合', '逐步上行', '保持统一'],
      },
      {
        id: 'level_3_1_3',
        courseId: 'technique',
        levelNumber: 3,
        title: '平滑过桥',
        description: '换声区突破',
        isUnlocked: false,
        isCompleted: false,
        icon: '🌉',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Woo~~~~',
          exercisePhonetic: '呜～',
          notes: [],
        },
        target: { oneStar: 45, twoStar: 60, threeStar: 75 },
        detectionMetrics: { metrics: ['换声平滑', '破音检测'] },
        tips: ['低到高连续', '避免破音', '气息支持'],
      },
    ],
  },
  // 单元10：高音密码
  {
    id: 'chapter_3_2',
    title: '高音密码',
    description: '高音突破训练',
    icon: '🔝',
    islandId: 3,
    unitId: 10,
    levels: [
      {
        id: 'level_3_2_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '叹气高音',
        description: '高音技巧',
        isUnlocked: false,
        isCompleted: false,
        icon: '🎈',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Ha~~~~',
          exercisePhonetic: '哈～',
          notes: [],
        },
        target: { oneStar: 45, twoStar: 60, threeStar: 75 },
        detectionMetrics: { metrics: ['高音稳定性', '气息支持'] },
        tips: ['想象向下', '气息支撑', '《死了都要爱》'],
      },
      {
        id: 'level_3_2_2',
        courseId: 'technique',
        levelNumber: 2,
        title: '边缘发声',
        description: '轻高音练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '🪶',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Yi~~~~',
          exercisePhonetic: '衣～',
          notes: [],
        },
        target: { oneStar: 40, twoStar: 55, threeStar: 70 },
        detectionMetrics: { metrics: ['轻音量控制', '高音准确性'] },
        tips: ['极小音量', '找到轻高音', '感受边缘振动'],
      },
    ],
  },
  // 单元11：颤音与律动
  {
    id: 'chapter_3_3',
    title: '颤音与律动',
    description: '装饰音和节奏',
    icon: '💫',
    islandId: 3,
    unitId: 11,
    levels: [
      {
        id: 'level_3_3_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '推肚子',
        description: '自然颤音练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '💪',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Ah Ah Ah Ah',
          exercisePhonetic: '啊 啊 啊 啊',
          notes: [],
          bpm: 80,
        },
        target: { oneStar: 50, twoStar: 65, threeStar: 80 },
        detectionMetrics: { metrics: ['颤音频率', '自然度'] },
        tips: ['逐步连起来', '感受腹部推送', '不要刻意'],
      },
      {
        id: 'level_3_3_2',
        courseId: 'technique',
        levelNumber: 2,
        title: '半音颤音',
        description: '技巧颤音练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '🎚️',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Do Do#',
          exercisePhonetic: '都~都#',
          notes: ['Do', 'Do#'],
        },
        target: { oneStar: 45, twoStar: 60, threeStar: 75 },
        detectionMetrics: { metrics: ['颤音频率', '半音准确'] },
        tips: ['5-7Hz', '快速交替', '保持音准'],
      },
      {
        id: 'level_3_3_3',
        courseId: 'style',
        levelNumber: 3,
        title: 'R&B切分',
        description: '节奏律动训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '🎶',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: '(休)唱 唱 (休)唱',
          exercisePhonetic: '~唱 唱~唱',
          notes: [],
          bpm: 90,
        },
        target: { oneStar: 55, twoStar: 70, threeStar: 85 },
        detectionMetrics: { metrics: ['节奏准确', '律动感'] },
        tips: ['《普通朋友》', '感受切分', '放松律动'],
      },
    ],
  },

  // ============ 岛屿四：艺术家殿堂 ============
  // 单元12：声音滤镜
  {
    id: 'chapter_4_1',
    title: '声音滤镜',
    description: '声线变化技巧',
    icon: '🎛️',
    islandId: 4,
    unitId: 12,
    levels: [
      {
        id: 'level_4_1_1',
        courseId: 'style',
        levelNumber: 1,
        title: '气声',
        description: '声线变化基础',
        isUnlocked: false,
        isCompleted: false,
        icon: '💨',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Ha~lo~',
          exercisePhonetic: '哈~咯~',
          notes: [],
        },
        target: { oneStar: 55, twoStar: 70, threeStar: 85 },
        detectionMetrics: { metrics: ['气声比例', '情感表达'] },
        tips: ['《红豆》', '气息包裹声音', '情感表达'],
      },
      {
        id: 'level_4_1_2',
        courseId: 'style',
        levelNumber: 2,
        title: '撕裂音',
        description: '摇滚声线',
        isUnlocked: false,
        isCompleted: false,
        icon: '🔥',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Hey! Yeah!',
          exercisePhonetic: '嘿! 耶!',
          notes: [],
        },
        target: { oneStar: 40, twoStar: 55, threeStar: 70 },
        detectionMetrics: { metrics: ['撕裂质量', '安全性'] },
        tips: ['《海阔天空》', '安全练习', '不要过度'],
      },
    ],
  },
  // 单元13：转音大师
  {
    id: 'chapter_4_2',
    title: '转音大师',
    description: '转音技巧训练',
    icon: '🎭',
    islandId: 4,
    unitId: 13,
    levels: [
      {
        id: 'level_4_2_1',
        courseId: 'technique',
        levelNumber: 1,
        title: '五声音阶',
        description: '华语转音基础',
        isUnlocked: false,
        isCompleted: false,
        icon: '🎹',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: 'Do Re Mi Sol La Sol Mi Re Do',
          exercisePhonetic: '都来米搜啦搜米来都',
          notes: ['Do', 'Re', 'Mi', 'Sol', 'La', 'Sol', 'Mi', 'Re', 'Do'],
          bpm: 70,
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 85 },
        detectionMetrics: { metrics: ['音准准确', '连贯性'] },
        tips: ['《爱很简单》', '感受五声', '流畅转换'],
      },
      {
        id: 'level_4_2_2',
        courseId: 'technique',
        levelNumber: 2,
        title: '连环转音',
        description: '复杂转音练习',
        isUnlocked: false,
        isCompleted: false,
        icon: '🔄',
        difficulty: 'hard',
        practiceContent: {
          exerciseText: 'Mi Fa Sol Fa Mi',
          exercisePhonetic: '米发搜发米',
          notes: ['Mi', 'Fa', 'Sol', 'Fa', 'Mi'],
          bpm: 80,
        },
        target: { oneStar: 50, twoStar: 65, threeStar: 80 },
        detectionMetrics: { metrics: ['转音速度', '准确性'] },
        tips: ['逐渐加速', '保持清晰', '感受滑音'],
      },
    ],
  },
  // 单元14：情感注入
  {
    id: 'chapter_4_3',
    title: '情感注入',
    description: '表达力训练',
    icon: '💖',
    islandId: 4,
    unitId: 14,
    levels: [
      {
        id: 'level_4_3_1',
        courseId: 'style',
        levelNumber: 1,
        title: '动态对比',
        description: '情感表达基础',
        isUnlocked: false,
        isCompleted: false,
        icon: '📊',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: '我还记得那天 你对我说再见',
          exercisePhonetic: '我还~记得~那天~你对我说~再见~',
          notes: [],
        },
        target: { oneStar: 60, twoStar: 75, threeStar: 85 },
        detectionMetrics: { metrics: ['动态变化', '情感表达'] },
        tips: ['《体面》', '主歌轻副歌强', '对比明显'],
      },
      {
        id: 'level_4_3_2',
        courseId: 'style',
        levelNumber: 2,
        title: '咬字语气',
        description: '咬字表达训练',
        isUnlocked: false,
        isCompleted: false,
        icon: '💬',
        difficulty: 'medium',
        practiceContent: {
          exerciseText: '不 要 离 开 我',
          exercisePhonetic: '不~要~离~开~我~',
          notes: [],
        },
        target: { oneStar: 55, twoStar: 70, threeStar: 85 },
        detectionMetrics: { metrics: ['咬字清晰', '动态变化'] },
        tips: ['强调辅音', '语气变化', '情感投入'],
      },
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
