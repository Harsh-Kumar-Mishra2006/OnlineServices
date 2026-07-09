import { apiService } from '../api/api';
import { type InitiatePaymentData, type VerifyPaymentData } from '../types';

class PaymentService {
  // ============= USER METHODS =============

  // Initiate payment with screenshot
  async initiatePayment(data: InitiatePaymentData): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('bill_id', data.bill_id);
      if (data.user_notes) {
        formData.append('user_notes', data.user_notes);
      }
      formData.append('screenshot', data.screenshot);

      const response = await apiService.post('/payments/initiate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to initiate payment'
      };
    }
  }

  // Get user's payments
  async getMyPayments(params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const response = await apiService.get('/payments/my-payments', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch payments'
      };
    }
  }

  // Get payment by ID (User)
  async getMyPaymentById(id: string): Promise<any> {
    try {
      const response = await apiService.get(`/payments/my-payments/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch payment'
      };
    }
  }

  // ============= ADMIN METHODS =============

  // Get all payments (Admin)
  async getAllPayments(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<any> {
    try {
      const response = await apiService.get('/payments/admin/all', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch payments'
      };
    }
  }

  // Get payment details (Admin)
  async getPaymentDetails(id: string): Promise<any> {
    try {
      const response = await apiService.get(`/payments/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch payment details'
      };
    }
  }

  // Verify payment (Admin)
  async verifyPayment(id: string, data: VerifyPaymentData): Promise<any> {
    try {
      const response = await apiService.put(`/payments/admin/${id}/verify`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to verify payment'
      };
    }
  }

  // Delete payment (Admin)
  async deletePayment(id: string): Promise<any> {
    try {
      const response = await apiService.delete(`/payments/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete payment'
      };
    }
  }
}

export default new PaymentService();