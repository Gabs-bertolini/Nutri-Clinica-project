import { api } from './api';
import type { Doubt, CreateDoubtPayload, UpdateDoubtPayload } from '../types';

export const doubtService = {
  async create(data: CreateDoubtPayload): Promise<Doubt> {
    const response = await api.post('/doubts', data);
    return response.data;
  },

  async getAll(): Promise<Doubt[]> {
    const response = await api.get('/doubts');
    return response.data;
  },

  async getById(id: string): Promise<Doubt> {
    const response = await api.get(`/doubts/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateDoubtPayload): Promise<Doubt> {
    const response = await api.patch(`/doubts/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/doubts/${id}`);
  },
};
