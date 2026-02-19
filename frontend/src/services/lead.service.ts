import { apiClient } from '../lib/api';
import type {
  ApiResponse,
  Lead,
  CreateLeadRequest,
  PaginatedApiResponse,
  ListLeadsQuery,
  LeadStatusType,
} from '../types';

export const leadService = {
  async create(data: CreateLeadRequest): Promise<ApiResponse<Lead>> {
    const response = await apiClient.post('/leads', data);
    return response.data;
  },

  async list(query: ListLeadsQuery): Promise<PaginatedApiResponse<Lead>> {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.course) params.append('course', query.course);
    if (query.status) params.append('status', query.status);

    const response = await apiClient.get(`/leads?${params.toString()}`);
    return response.data;
  },

  async updateStatus(
    id: string,
    status: LeadStatusType
  ): Promise<ApiResponse<Lead>> {
    const response = await apiClient.patch(`/leads/${id}/status`, { status });
    return response.data;
  },
};
