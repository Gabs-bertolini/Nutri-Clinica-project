import { api } from './api';
import type { Patient } from '../types';

export const patientService = {
  async create(userId: string, data: any): Promise<Patient> {
    const response = await api.post('/patients', {
      userId,
      ...data,
    });
    return response.data;
  },

  async getAll(): Promise<Patient[]> {
    const response = await api.get('/patients');
    return response.data;
  },

  async getById(id: string): Promise<Patient> {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async update(id: string, data: any): Promise<Patient> {
    const response = await api.patch(`/patients/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/patients/${id}`);
  },
};
