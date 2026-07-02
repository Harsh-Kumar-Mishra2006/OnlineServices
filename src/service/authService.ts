import { apiService,type ApiResponse } from '../api/api';
import { 
  type LoginCredentials, 
  type SignupData, 
  type AuthResponse, 
  type User, 
  type Worker,
  type CreateWorkerData 
} from '../types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  CHECK_WORKER: '/auth/check-worker',
  WORKER_PROFILE: '/auth/worker/profile',
  WORKERS: '/auth/workers',
  WORKER_BY_ID: (id: string) => `/auth/workers/${id}`,
  ADMIN_CREATE_WORKER: '/auth/admin/create-worker',
  ADMIN_WORKERS: '/auth/admin/workers',
  ADMIN_WORKER_STATUS: (id: string) => `/auth/admin/workers/${id}/status`,
  ADMIN_WORKER_DELETE: (id: string) => `/auth/admin/workers/${id}`,
};

// Extended response type that includes user property
interface AuthApiResponse extends ApiResponse<string> {
  user?: User;
}

class AuthService {
  // Login user - supports phone, email, or username
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // If phone is provided, use it
      // Otherwise use email or username
      const loginData: any = {
        password: credentials.password
      };
      
      if (credentials.phone) {
        loginData.phone = credentials.phone;
      } else if (credentials.email) {
        loginData.email = credentials.email;
      } else if (credentials.username) {
        loginData.username = credentials.username;
      }

      const response = await apiService.post<AuthApiResponse>(AUTH_ENDPOINTS.LOGIN, loginData);
      const data = response.data;
      
      if (data) {
        if (typeof data.data === 'string' && data.data) {
          localStorage.setItem('token', data.data);
        }
        
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }
      
      return {
        success: data?.success || false,
        data: typeof data?.data === 'string' ? data.data : undefined,
        user: data?.user,
        message: data?.message,
        error: data?.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Network error. Please try again.'
      };
    }
  }

  // Signup new user - email and username are optional
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const signupData: any = {
        name: data.name,
        phone: data.phone,
        password: data.password,
        role: data.role || 'user'
      };
      
      // Only include email and username if they exist
      if (data.email) signupData.email = data.email;
      if (data.username) signupData.username = data.username;
      if (data.age) signupData.age = data.age;
      if (data.gender) signupData.gender = data.gender;
      if (data.dob) signupData.dob = data.dob;
      
      const response = await apiService.post<AuthApiResponse>(AUTH_ENDPOINTS.SIGNUP, signupData);
      const responseData = response.data;
      
      return {
        success: responseData?.success || false,
        data: responseData?.data,
        user: responseData?.user,
        message: responseData?.message,
        error: responseData?.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Network error. Please try again.'
      };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiService.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  // Get user profile
  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await apiService.get<AuthApiResponse>(AUTH_ENDPOINTS.PROFILE);
      const data = response.data;
      
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return {
        success: data?.success || false,
        data: data?.data,
        user: data?.user,
        message: data?.message,
        error: data?.error
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get profile'
      };
    }
  }

  // Check worker authorization status
  async checkWorkerStatus(): Promise<any> {
    try {
      const response = await apiService.get(AUTH_ENDPOINTS.CHECK_WORKER);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to check worker status'
      };
    }
  }

  // Update worker profile
  async updateWorkerProfile(data: Partial<Worker>): Promise<any> {
    try {
      const response = await apiService.put(AUTH_ENDPOINTS.WORKER_PROFILE, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update worker profile'
      };
    }
  }

  // Get all workers with filters
  async getAllWorkers(filters?: {
    service_type?: string;
    city?: string;
    min_rate?: number;
    max_rate?: number;
  }): Promise<any> {
    try {
      const response = await apiService.get(AUTH_ENDPOINTS.WORKERS, {
        params: filters
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch workers'
      };
    }
  }

  // Get worker by ID
  async getWorkerById(id: string): Promise<any> {
    try {
      const response = await apiService.get(AUTH_ENDPOINTS.WORKER_BY_ID(id));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch worker'
      };
    }
  }

  // ADMIN: Create worker
  async createWorkerByAdmin(workerData: CreateWorkerData): Promise<any> {
    try {
      const response = await apiService.post(AUTH_ENDPOINTS.ADMIN_CREATE_WORKER, workerData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create worker'
      };
    }
  }

  // ADMIN: Get all workers (including pending/inactive)
  async getAllWorkersForAdmin(): Promise<any> {
    try {
      const response = await apiService.get(AUTH_ENDPOINTS.ADMIN_WORKERS);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch workers'
      };
    }
  }

  // ADMIN: Update worker status
  async updateWorkerStatus(workerId: string, status: string): Promise<any> {
    try {
      const response = await apiService.put(AUTH_ENDPOINTS.ADMIN_WORKER_STATUS(workerId), { status });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update worker status'
      };
    }
  }

  // ADMIN: Delete worker
  async deleteWorker(workerId: string): Promise<any> {
    try {
      const response = await apiService.delete(AUTH_ENDPOINTS.ADMIN_WORKER_DELETE(workerId));
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete worker'
      };
    }
  }

  // Helper methods
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  updateLocalUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export default new AuthService();