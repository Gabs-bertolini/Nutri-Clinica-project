import { api } from './api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post('/auth/login', payload);
    const { access_token, user } = response.data;
    
    // Salvar token e user no localStorage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post('/auth/register', payload);
    const { access_token, user } = response.data;
    
    // Salvar token e user no localStorage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
