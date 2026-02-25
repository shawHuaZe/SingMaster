/**
 * User Service - 用户服务
 * 处理用户相关的业务逻辑
 */

import { User } from '../../shared/types';
import { useUserStore } from '../../core/storage/userStore';

// 用户数据结构（来自后端）
export interface UserDTO {
  id: string;
  phone: string;
  nickname: string;
  avatar?: string;
  level: number;
  experience: number;
  createdAt: string;
  settings?: {
    notifications: boolean;
    soundEffects: boolean;
    darkMode: boolean;
  };
}

// 注册请求
export interface RegisterRequest {
  phone: string;
  nickname: string;
  code: string; // 验证码
}

// 登录请求
export interface LoginRequest {
  phone: string;
  code: string;
}

class UserService {
  private static instance: UserService;

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * 发送验证码
   */
  async sendVerificationCode(phone: string): Promise<boolean> {
    // TODO: 调用后端 API
    console.log('发送验证码到:', phone);
    return true;
  }

  /**
   * 用户登录
   */
  async login(request: LoginRequest): Promise<User> {
    // TODO: 调用后端 API
    // const response = await apiClient.post<UserDTO>('/auth/login', request);
    // return this.mapUserFromDTO(response);

    // 使用本地存储
    const userStore = useUserStore.getState();
    return userStore.user as User;
  }

  /**
   * 用户注册
   */
  async register(request: RegisterRequest): Promise<User> {
    // TODO: 调用后端 API
    console.log('用户注册:', request);
    throw new Error('Not implemented');
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: string): Promise<User | null> {
    // TODO: 调用后端 API
    const userStore = useUserStore.getState();
    return userStore.user;
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userId: string, data: Partial<UserDTO>): Promise<User> {
    // TODO: 调用后端 API
    console.log('更新用户信息:', userId, data);
    throw new Error('Not implemented');
  }

  /**
   * 更新用户设置
   */
  async updateUserSettings(
    userId: string,
    settings: { notifications?: boolean; soundEffects?: boolean; darkMode?: boolean }
  ): Promise<void> {
    // TODO: 调用后端 API
    console.log('更新用户设置:', userId, settings);
  }

  /**
   * 退出登录
   */
  async logout(): Promise<void> {
    // TODO: 调用后端 API
    const userStore = useUserStore.getState();
    userStore.logout();
  }

  /**
   * DTO 映射
   */
  private mapUserFromDTO(dto: UserDTO): User {
    return {
      id: dto.id,
      phone: dto.phone,
      nickname: dto.nickname,
      avatar: dto.avatar,
      level: dto.level,
      experience: dto.experience,
      createdAt: dto.createdAt,
    };
  }
}

export const userService = UserService.getInstance();
export default userService;
