import { apiClient } from '../lib/api';
import type { ApiResponse, Admin, LoginRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<ApiResponse<{ admin: Admin }>> {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  async me(): Promise<ApiResponse<{ admin: Admin }>> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
