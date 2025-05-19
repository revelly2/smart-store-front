
import { Product, ApiResponse, Sale } from '../types/api';

// Base URL for API - would be environment variable in production
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle responses
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    return { success: false, error: errorData.error || `Error ${response.status}: ${response.statusText}` };
  }
  
  const data = await response.json();
  return { success: true, data };
};

// Get auth header with token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Product API
export const productApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<Product[]>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to fetch products' };
    }
  },
  
  get: async (id: number): Promise<ApiResponse<Product>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<Product>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to fetch product' };
    }
  },
  
  create: async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Product>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return handleResponse<Product>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to create product' };
    }
  },
  
  update: async (id: number, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(data),
      });
      return handleResponse<Product>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to update product' };
    }
  },
  
  delete: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<void>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to delete product' };
    }
  },
};

// Sales API
export const salesApi = {
  create: async (sale: { payment_method: string; items: { product_id: number; quantity: number }[] }): Promise<ApiResponse<Sale>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(sale),
      });
      return handleResponse<Sale>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to create sale' };
    }
  },
  
  getAll: async (): Promise<ApiResponse<Sale[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<Sale[]>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to fetch sales' };
    }
  },
  
  get: async (id: number): Promise<ApiResponse<Sale>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return handleResponse<Sale>(response);
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error: 'Failed to fetch sale' };
    }
  },
};

// For demo purposes - generate receipt PDF
export const generateReceipt = async (saleId: number): Promise<Blob | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sales/${saleId}/receipt`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate receipt');
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Receipt generation error:', error);
    return null;
  }
};
