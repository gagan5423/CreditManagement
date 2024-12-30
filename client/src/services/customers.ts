import api from './api';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  shop_owner_id: number;
  outstanding_credit: number; // Add outstanding_credit field
  created_at: string;
}

export interface CreateCustomer {
  name: string;
  phone: string;
  email: string;
  shop_owner_id: number;
}

export const customerService = {
  async getAll() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const { data } = await api.get<Customer[]>('/customers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async create(customer: CreateCustomer) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const { data } = await api.post('/customers', customer, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
};