import { apiService } from '../api/api';
import { type CreateBillData, type UpdateBillData } from '../types';

class BillingService {
  // ============= USER METHODS =============
  
  // Get user's bills
  async getMyBills(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const response = await apiService.get('/bills/my-bills', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bills'
      };
    }
  }

  // Get bill summary for user dashboard
  async getBillSummary(): Promise<any> {
    try {
      const response = await apiService.get('/bills/my-bills/summary');
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bill summary'
      };
    }
  }

  // Get user bill by ID
  async getUserBillById(id: string): Promise<any> {
    try {
      const response = await apiService.get(`/bills/my-bills/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bill'
      };
    }
  }

  // ============= ADMIN METHODS =============

  // Create bill
  async createBill(data: CreateBillData): Promise<any> {
    try {
      const response = await apiService.post('/bills/admin/create', data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create bill'
      };
    }
  }

  // Get all bills (admin)
  async getAllBills(params?: {
    status?: string;
    user_id?: string;
    query_id?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<any> {
    try {
      const response = await apiService.get('/bills/admin/all', { params });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bills'
      };
    }
  }

  // Get bill by ID (admin)
  async getBillById(id: string): Promise<any> {
    try {
      const response = await apiService.get(`/bills/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bill'
      };
    }
  }

  // Update bill (admin)
  async updateBill(id: string, data: UpdateBillData): Promise<any> {
    try {
      const response = await apiService.put(`/bills/admin/${id}`, data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update bill'
      };
    }
  }

  // Delete bill (admin)
  async deleteBill(id: string): Promise<any> {
    try {
      const response = await apiService.delete(`/bills/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete bill'
      };
    }
  }

  // Mark bill as paid (admin)
  async markBillAsPaid(id: string, paymentMethod?: string, transactionId?: string): Promise<any> {
    try {
      const response = await apiService.put(`/bills/admin/${id}/pay`, {
        payment_method: paymentMethod,
        payment_transaction_id: transactionId
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to mark bill as paid'
      };
    }
  }
}

export default new BillingService();