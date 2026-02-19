import { create } from 'zustand';
import type { Lead, LeadStatusType, ListLeadsQuery, PaginationMeta } from '../types';
import { leadService } from '../services/lead.service';

interface LeadState {
  leads: Lead[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  
  // Query state
  query: ListLeadsQuery;
  
  // Actions
  fetchLeads: (query?: ListLeadsQuery) => Promise<void>;
  createLead: (data: Omit<Lead, 'id' | 'status' | 'sheetRowId' | 'createdAt'>) => Promise<void>;
  updateLeadStatus: (id: string, status: LeadStatusType) => Promise<void>;
  setQuery: (query: Partial<ListLeadsQuery>) => void;
  clearError: () => void;
}

const defaultQuery: ListLeadsQuery = {
  page: 1,
  limit: 10,
};

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  pagination: null,
  isLoading: false,
  error: null,
  query: defaultQuery,

  fetchLeads: async (query?: ListLeadsQuery) => {
    const currentQuery = query || get().query;
    set({ isLoading: true, error: null });
    
    try {
      const response = await leadService.list(currentQuery);
      set({
        leads: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch leads',
        isLoading: false,
      });
    }
  },

  createLead: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await leadService.create(data);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create lead',
        isLoading: false,
      });
      throw error;
    }
  },

  updateLeadStatus: async (id: string, status: LeadStatusType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await leadService.updateStatus(id, status);
      const updatedLead = response.data;
      
      set((state) => ({
        leads: state.leads.map((lead) =>
          lead.id === id ? updatedLead : lead
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update lead status',
        isLoading: false,
      });
      throw error;
    }
  },

  setQuery: (query: Partial<ListLeadsQuery>) => {
    set((state) => ({
      query: { ...state.query, ...query, page: query.page || 1 },
    }));
  },

  clearError: () => set({ error: null }),
}));
