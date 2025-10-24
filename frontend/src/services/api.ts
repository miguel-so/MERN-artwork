import axios, { AxiosResponse } from 'axios';
import { 
  AuthResponse, 
  User, 
  Artist, 
  Artwork, 
  Category, 
  ContactForm, 
  ApiResponse, 
  PaginatedResponse,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordData,
  NewPasswordData
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/login', credentials),
  
  register: (credentials: RegisterCredentials): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/register', credentials),
  
  forgotPassword: (data: ResetPasswordData): Promise<AxiosResponse<ApiResponse<{ message: string }>>> =>
    api.post('/auth/forgot-password', data),
  
  resetPassword: (data: NewPasswordData): Promise<AxiosResponse<ApiResponse<{ message: string }>>> =>
    api.post('/auth/reset-password', data),
  
  getProfile: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/auth/profile'),
  
  updateProfile: (data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/auth/profile', data),
};

// Artwork API
export const artworkAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sold?: boolean;
  }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Artwork>>>> =>
    api.get('/artworks', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<Artwork>>> =>
    api.get(`/artworks/${id}`),
  
  create: (data: Omit<Artwork, '_id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<ApiResponse<Artwork>>> =>
    api.post('/artworks', data),
  
  update: (id: string, data: Partial<Artwork>): Promise<AxiosResponse<ApiResponse<Artwork>>> =>
    api.put(`/artworks/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<{ message: string }>>> =>
    api.delete(`/artworks/${id}`),
  
  getByArtist: (artistId: string): Promise<AxiosResponse<ApiResponse<Artwork[]>>> =>
    api.get(`/artworks/artist/${artistId}`),
};

// Artist API
export const artistAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Artist>>>> =>
    api.get('/artists', { params }),
  
  getById: (id: string): Promise<AxiosResponse<ApiResponse<Artist>>> =>
    api.get(`/artists/${id}`),
  
  updateStatus: (id: string, isActive: boolean): Promise<AxiosResponse<ApiResponse<Artist>>> =>
    api.put(`/artists/${id}/status`, { isActive }),
  
  update: (id: string, data: Partial<Artist>): Promise<AxiosResponse<ApiResponse<Artist>>> =>
    api.put(`/artists/${id}`, data),
};

// Category API
export const categoryAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Category[]>>> =>
    api.get('/categories'),
  
  create: (data: Omit<Category, '_id'>): Promise<AxiosResponse<ApiResponse<Category>>> =>
    api.post('/categories', data),
  
  update: (id: string, data: Partial<Category>): Promise<AxiosResponse<ApiResponse<Category>>> =>
    api.put(`/categories/${id}`, data),
  
  delete: (id: string): Promise<AxiosResponse<ApiResponse<{ message: string }>>> =>
    api.delete(`/categories/${id}`),
};

// Contact API
export const contactAPI = {
  sendMessage: (data: ContactForm): Promise<AxiosResponse<ApiResponse<{ message: string }>>> =>
    api.post('/contact', data),
};

export default api;
