
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'cashier';
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: number;
  cashier_id: number;
  cashier_name: string;
  total: number;
  payment_method: 'cash' | 'card';
  created_at: string;
  items: SaleItem[];
}

export interface SaleItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
