export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
} as const;

export type LeadStatusType = typeof LeadStatus[keyof typeof LeadStatus];

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  college: string;
  year: string;
  status: LeadStatusType;
  sheetRowId: string | null;
  createdAt: string;
}

export interface CreateLeadRequest {
  name: string;
  email: string;
  phone: string;
  course: string;
  college: string;
  year: string;
}

export interface Admin {
  id: string;
  email: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface ListLeadsQuery {
  page?: number;
  limit?: number;
  search?: string;
  course?: string;
  status?: LeadStatusType;
}
