import axios, { 
  type AxiosInstance, 
  type InternalAxiosRequestConfig,
  type AxiosResponse, 
  type AxiosError 
} from 'axios';

// API Base URL configuration
const API_BASE_URL = 'https://onlineservices-backend.onrender.com/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API response interface - FIXED: Made it generic with proper typing
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Generic API methods
export const apiService = {
  get: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> => {
    return api.patch<T>(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: any): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, config);
  },
};

export default api;