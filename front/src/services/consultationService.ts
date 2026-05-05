import { api } from './api';
import type { Consultation, CreateConsultationPayload, UpdateConsultationPayload } from '../types';

export const consultationService = {
  async create(data: CreateConsultationPayload): Promise<Consultation> {
    const response = await api.post('/consultations', data);
    return response.data;
  },

  async getAll(): Promise<Consultation[]> {
    const response = await api.get('/consultations');
    return response.data;
  },

  async getById(id: string): Promise<Consultation> {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateConsultationPayload): Promise<Consultation> {
    const response = await api.patch(`/consultations/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/consultations/${id}`);
  },
};
