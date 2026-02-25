/**
 * API Client - 基础 API 客户端
 * 负责与后端服务器通信，支持模拟模式和真实API模式
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 配置
const API_CONFIG = {
  // 开发环境使用模拟模式
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.singmaster.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 是否使用模拟数据（开发环境）
const USE_MOCK = !process.env.EXPO_PUBLIC_API_URL;

class ApiClient {
  private client: AxiosInstance;
  private static instance: ApiClient;

  private constructor() {
    this.client = axios.create(API_CONFIG);

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证 token
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // 统一错误处理
        if (error.response?.status === 401) {
          // Token 过期，清除本地存储
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getToken(): string | null {
    // 从 AsyncStorage 获取 token（需要实现）
    return null;
  }

  private clearToken(): void {
    // 清除 token（需要实现）
  }

  // GET 请求
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      return this.mockResponse<T>(url, 'GET');
    }
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  // POST 请求
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      return this.mockResponse<T>(url, 'POST', data);
    }
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  // PUT 请求
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      return this.mockResponse<T>(url, 'PUT', data);
    }
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  // DELETE 请求
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      return this.mockResponse<T>(url, 'DELETE');
    }
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  // 模拟响应（开发模式）
  private mockResponse<T>(_url: string, _method: string, _data?: any): Promise<T> {
    // 返回空数据，具体由各服务处理
    return Promise.resolve({} as T);
  }
}

export const apiClient = ApiClient.getInstance();
export default apiClient;
