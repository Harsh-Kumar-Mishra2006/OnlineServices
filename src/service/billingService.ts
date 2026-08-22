// service/billingService.ts
import { apiService } from '../api/api';
import { type CreateBillData, type UpdateBillData } from '../types';

class BillingService {
  // ============= USER METHODS =============
  
  // Get user's bills
  async getMyBills(params?: {
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

  // Create bill (Manual Entry) - with FormData for file upload
  async createBill(data: CreateBillData): Promise<any> {
    try {
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(data).forEach(key => {
        if (key === 'qr_code' && data.qr_code) {
          // Handle file separately
          formData.append('qr_code', data.qr_code);
        } else if (key === 'items') {
          // Convert items to JSON string
          formData.append('items', JSON.stringify(data.items));
        } else if (key === 'customer_address' && data.customer_address) {
          // Convert address to JSON string
          formData.append('customer_address', JSON.stringify(data.customer_address));
        } else if (data[key as keyof CreateBillData] !== undefined && data[key as keyof CreateBillData] !== null) {
          formData.append(key, String(data[key as keyof CreateBillData]));
        }
      });

      const response = await apiService.post('/bills/admin/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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

  // Update bill (admin) - with FormData for file upload
  async updateBill(id: string, data: UpdateBillData): Promise<any> {
    try {
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(data).forEach(key => {
        if (key === 'qr_code' && data.qr_code) {
          // Handle file separately
          formData.append('qr_code', data.qr_code);
        } else if (key === 'items' && data.items) {
          // Convert items to JSON string
          formData.append('items', JSON.stringify(data.items));
        } else if (key === 'customer_address' && data.customer_address) {
          // Convert address to JSON string
          formData.append('customer_address', JSON.stringify(data.customer_address));
        } else if (data[key as keyof UpdateBillData] !== undefined && data[key as keyof UpdateBillData] !== null) {
          formData.append(key, String(data[key as keyof UpdateBillData]));
        }
      });

      const response = await apiService.put(`/bills/admin/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
}

export default new BillingService();