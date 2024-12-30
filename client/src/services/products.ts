import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  shop_owner_id: number;
}

export const productService = {
  async getAll() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const { data } = await api.get<Product[]>('/products', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async create(product: CreateProduct) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const { data } = await api.post('/products', product, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
};