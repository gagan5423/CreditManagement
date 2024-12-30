import api from './api';
import { User } from '../types/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  shopName: string;
  location: string;
  email: string;
  contact: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { data } = await api.post<{ user: Omit<User, 'password'>; token: string }>('/users/login', credentials);
    return data;
  },

  async register(userData: RegisterData): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { data } = await api.post<{ user: Omit<User, 'password'>; token: string }>('/users/register', userData);
    return data;
  },

  async getCurrentUser(token: string): Promise<Omit<User, 'password'>> {
    const { data } = await api.get<Omit<User, 'password'>>('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
};