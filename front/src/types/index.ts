export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'NUTRITIONIST' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  birthDate?: string;
  gender?: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Consultation {
  id: string;
  patientId: string;
  nutritionistId: string;
  date: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  nutritionist?: User;
}

export interface Doubt {
  id: string;
  title: string;
  question: string;
  answerText?: string;
  isPublic: boolean;
  patientId: string;
  nutritionistId?: string;
  createdAt: string;
  updatedAt: string;
  patient?: Patient;
  nutritionist?: User;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'PATIENT' | 'NUTRITIONIST';
}

export interface CreateConsultationPayload {
  patientId: string;
  nutritionistId: string;
  date: string;
  notes?: string;
}

export interface UpdateConsultationPayload {
  status?: string;
  notes?: string;
  date?: string;
}

export interface CreateDoubtPayload {
  title: string;
  question: string;
  isPublic: boolean;
}

export interface UpdateDoubtPayload {
  title?: string;
  question?: string;
  answerText?: string;
  isPublic?: boolean;
}
