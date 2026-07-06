import { apiService} from '../api/api';
import { 
  type CreateQueryData, 
  type UpdateQueryData, 
} from '../types';

const QUERY_ENDPOINTS = {
  CREATE: '/queries/create',
  MY_QUERIES: '/queries/my-queries',
  GET_BY_ID: (id: string) => `/queries/${id}`,
  UPDATE: (id: string) => `/queries/${id}`,
  CANCEL: (id: string) => `/queries/${id}`,
  SUBMIT_RATING: (id: string) => `/queries/${id}/rating`,
  
  // Admin
  ADMIN_ALL: '/queries/admin/all',
  ADMIN_ASSIGN: (id: string) => `/queries/admin/${id}/assign`,
  ADMIN_STATUS: (id: string) => `/queries/admin/${id}/status`,
  ADMIN_COUNTS: '/queries/admin/dashboard/counts',
  ADMIN_AVAILABLE_WORKERS: (id: string) => `/queries/admin/${id}/available-workers`,
};

class QueryService {
  // ============= USER METHODS =============

  // Create a new query
  async createQuery(data: CreateQueryData): Promise<any> {
    try {
      const response = await apiService.post(QUERY_ENDPOINTS.CREATE, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create query'
      };
    }
  }

  // Get user's own queries
  async getMyQueries(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const response = await apiService.get(QUERY_ENDPOINTS.MY_QUERIES, {
        params
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch queries'
      };
    }
  }

  // Get query by ID
  async getQueryById(id: string): Promise<any> {
    try {
      const response = await apiService.get(QUERY_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch query'
      };
    }
  }

  // Update query
  async updateQuery(id: string, data: UpdateQueryData): Promise<any> {
    try {
      const response = await apiService.put(QUERY_ENDPOINTS.UPDATE(id), data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update query'
      };
    }
  }

  // Cancel query
  async cancelQuery(id: string): Promise<any> {
    try {
      const response = await apiService.delete(QUERY_ENDPOINTS.CANCEL(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to cancel query'
      };
    }
  }

  // Submit rating
  async submitRating(id: string, rating: number, feedback?: string): Promise<any> {
    try {
      const response = await apiService.post(QUERY_ENDPOINTS.SUBMIT_RATING(id), {
        rating,
        feedback
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to submit rating'
      };
    }
  }

  // ============= ADMIN METHODS =============

  // Get all queries with filters (for admin)
  async getAllQueries(params?: {
    status?: string;
    service_type?: string;
    urgency?: string;
    city?: string;
    assigned?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<any> {
    try {
      const response = await apiService.get(QUERY_ENDPOINTS.ADMIN_ALL, {
        params
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch queries'
      };
    }
  }

  // Assign worker to query (Admin) - FIXED: Removed 'const' and added as class method
  async assignWorker(
    queryId: string,
    workerId: string,
    scheduledDate?: string,
    adminNotes?: string
  ): Promise<any> {
    try {
      console.log(`📤 Assigning worker ${workerId} to query ${queryId}`);
      
      const response = await apiService.post(QUERY_ENDPOINTS.ADMIN_ASSIGN(queryId), {
        worker_id: workerId,
        scheduled_date: scheduledDate || null,
        admin_notes: adminNotes || ''
      });
      
      console.log(`✅ Worker assigned successfully:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error assigning worker:', error.response?.data || error.message);
      
      // Return detailed error message
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to assign worker'
      };
    }
  }

  // Update query status (admin/worker)
  async updateQueryStatus(queryId: string, status: string, workerNotes?: string): Promise<any> {
    try {
      const response = await apiService.put(QUERY_ENDPOINTS.ADMIN_STATUS(queryId), {
        status,
        worker_notes: workerNotes
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update status'
      };
    }
  }

  // Get dashboard counts (admin)
  async getDashboardCounts(): Promise<any> {
    try {
      const response = await apiService.get(QUERY_ENDPOINTS.ADMIN_COUNTS);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch counts'
      };
    }
  }

  // Get available workers for query (admin)
  async getAvailableWorkers(queryId: string): Promise<any> {
    try {
      const response = await apiService.get(QUERY_ENDPOINTS.ADMIN_AVAILABLE_WORKERS(queryId));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch available workers'
      };
    }
  }

  // ============= ASSIGNMENT MANAGEMENT =============

// Get all assignments with filters
async getAllAssignments(params?: {
  status?: string;
  worker_id?: string;
  service_type?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}): Promise<any> {
  try {
    const response = await apiService.get('/queries/admin/assignments/all', {
      params
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch assignments'
    };
  }
}

// Reassign worker
async reassignWorker(
  queryId: string,
  newWorkerId: string,
  scheduledDate?: string,
  adminNotes?: string
): Promise<any> {
  try {
    const response = await apiService.put(
      `/queries/admin/assignments/${queryId}/reassign`,
      {
        worker_id: newWorkerId,
        scheduled_date: scheduledDate || null,
        admin_notes: adminNotes || ''
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to reassign worker'
    };
  }
}

// Get assignment statistics
async getAssignmentStats(): Promise<any> {
  try {
    const response = await apiService.get('/queries/admin/assignments/stats');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch assignment stats'
    };
  }
}


// ============= WORKER ASSIGNMENT METHODS =============

// Get worker's own assignments
async getWorkerAssignments(params?: {
  status?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}): Promise<any> {
  try {
    const response = await apiService.get('/worker/assignments/my-assignments', {
      params
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch assignments'
    };
  }
}

// Get assignment details for worker
async getWorkerAssignmentDetails(id: string): Promise<any> {
  try {
    const response = await apiService.get(`/worker/assignments/${id}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch assignment details'
    };
  }
}

// Update assignment status (worker)
async updateWorkerAssignmentStatus(
  id: string,
  status: string,
  workerNotes?: string,
  completionNotes?: string
): Promise<any> {
  try {
    const response = await apiService.put(`/worker/assignments/${id}/status`, {
      status,
      worker_notes: workerNotes,
      completion_notes: completionNotes
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to update assignment status'
    };
  }
}

// Submit completion report
async submitCompletionReport(
  id: string,
  data: {
    actual_hours: number;
    completion_notes?: string;
    photos?: string[];
  }
): Promise<any> {
  try {
    const response = await apiService.post(`/worker/assignments/${id}/complete`, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to submit completion report'
    };
  }
}

// Get worker dashboard stats
async getWorkerDashboardStats(): Promise<any> {
  try {
    const response = await apiService.get('/worker/assignments/dashboard/stats');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch dashboard stats'
    };
  }
}
}

export default new QueryService();