import { apiService } from '../api/api';
import { type CreateAssignmentData } from '../types';

const ASSIGNMENT_ENDPOINTS = {
  // Admin
  ADMIN_CREATE: '/assignments/admin/create',
  ADMIN_ALL: '/assignments/admin/all',
  ADMIN_GET: (id: string) => `/assignments/admin/${id}`,
  ADMIN_CANCEL: (id: string) => `/assignments/admin/${id}/cancel`,
  
  // Worker
  WORKER_MY: '/assignments/worker/my-assignments',
  WORKER_ACCEPT: (id: string) => `/assignments/worker/${id}/accept`,
  WORKER_REJECT: (id: string) => `/assignments/worker/${id}/reject`,
  WORKER_START: (id: string) => `/assignments/worker/${id}/start`,
  WORKER_COMPLETE: (id: string) => `/assignments/worker/${id}/complete`,
  
  // User
  USER_MY: '/assignments/user/my-assignments',
  
  // Shared
  GET_BY_ID: (id: string) => `/assignments/${id}`,
};

class AssignmentService {
  // ============= ADMIN METHODS =============
  
  // Create a new assignment
  async createAssignment(data: CreateAssignmentData): Promise<any> {
    try {
      const response = await apiService.post(ASSIGNMENT_ENDPOINTS.ADMIN_CREATE, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create assignment'
      };
    }
  }

  // Get all assignments (admin)
  async getAllAssignments(params?: {
    status?: string;
    worker_id?: string;
    query_id?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<any> {
    try {
      const response = await apiService.get(ASSIGNMENT_ENDPOINTS.ADMIN_ALL, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assignments'
      };
    }
  }

  // Get assignment by ID (admin)
  async getAssignmentById(id: string): Promise<any> {
    try {
      const response = await apiService.get(ASSIGNMENT_ENDPOINTS.ADMIN_GET(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assignment'
      };
    }
  }

  // Cancel assignment (admin)
  async cancelAssignment(id: string): Promise<any> {
    try {
      const response = await apiService.delete(ASSIGNMENT_ENDPOINTS.ADMIN_CANCEL(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to cancel assignment'
      };
    }
  }

  // ============= WORKER METHODS =============
  
  // Get worker's assignments
  async getMyWorkerAssignments(params?: { status?: string; page?: number; limit?: number }): Promise<any> {
    try {
      const response = await apiService.get(ASSIGNMENT_ENDPOINTS.WORKER_MY, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assignments'
      };
    }
  }

  // Accept assignment
  async acceptAssignment(id: string, worker_notes?: string): Promise<any> {
    try {
      const response = await apiService.put(ASSIGNMENT_ENDPOINTS.WORKER_ACCEPT(id), { worker_notes });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to accept assignment'
      };
    }
  }

  // Reject assignment
  async rejectAssignment(id: string, worker_notes?: string): Promise<any> {
    try {
      const response = await apiService.put(ASSIGNMENT_ENDPOINTS.WORKER_REJECT(id), { worker_notes });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to reject assignment'
      };
    }
  }

  // Start work
  async startWork(id: string): Promise<any> {
    try {
      const response = await apiService.put(ASSIGNMENT_ENDPOINTS.WORKER_START(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to start work'
      };
    }
  }

  // Complete work
  async completeWork(id: string, data: { completion_notes?: string; actual_hours?: number; completion_rating?: number }): Promise<any> {
    try {
      const response = await apiService.put(ASSIGNMENT_ENDPOINTS.WORKER_COMPLETE(id), data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to complete work'
      };
    }
  }

  // ============= USER METHODS =============
  
  // Get user's assignments
  async getUserAssignments(params?: { status?: string; page?: number; limit?: number }): Promise<any> {
    try {
      const response = await apiService.get(ASSIGNMENT_ENDPOINTS.USER_MY, { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assignments'
      };
    }
  }

  // Get assignment by ID (shared)
  async getAssignmentByIdShared(id: string): Promise<any> {
    try {
      const response = await apiService.get(ASSIGNMENT_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assignment'
      };
    }
  }
}

export default new AssignmentService();