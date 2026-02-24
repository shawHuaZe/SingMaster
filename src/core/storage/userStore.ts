// User Store - Zustand
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../../shared/types';

const STORAGE_KEYS = {
  USER: '@singmaster_user',
  AUTH_TOKEN: '@singmaster_token',
};

interface UserStore extends AuthState {
  // Actions
  login: (phone: string, code: string) => Promise<void>;
  register: (phone: string, code: string, nickname: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  loadUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (phone: string, code: string) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: 'user_' + Date.now(),
        phone,
        nickname: '用户' + phone.slice(-4),
        level: 1,
        experience: 0,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (phone: string, code: string, nickname: string) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: 'user_' + Date.now(),
        phone,
        nickname,
        level: 1,
        experience: 0,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    AsyncStorage.removeItem(STORAGE_KEYS.USER);
    AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  updateProfile: (data: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (userData) {
        const user = JSON.parse(userData) as User;
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;
