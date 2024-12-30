import api from './api';

export interface Transaction {
  total_product_price(total_product_price: any): number;
  id: string;
  customer_id: number;
  product_id: number;
  quantity: number;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  due_date: string;
  shop_owner_id: number;
  created_at: string;
}

export interface CreateTransaction {
  customer_id: number;
  product_id: number;
  quantity: number;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  due_date: string;
  shop_owner_id: number;
}

export interface Payment {
  customer_id: number;
  shop_owner_id: number;
  amount: number;
  payment_date: string;
}

export const transactionService = {
  async getAll() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const { data } = await api.get<Transaction[]>('/transactions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async create(transaction: CreateTransaction) {
    const token = localStorage.getItem('token');
    console.log('Creating transaction for product .ts', transaction);
    if (!token) throw new Error('No token found');

    const { data } = await api.post('/transactions', transaction, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },

  async recordPayment(payment: Payment) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const { data } = await api.post('/transactions/payments', payment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
};