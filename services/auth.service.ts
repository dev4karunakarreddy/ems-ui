// services/auth.service.ts - Updated to use axiosInstance instead of nextaxios
import { axiosInstance } from './axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role?: string;
}

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  const body = new URLSearchParams({
    grant_type: 'password',
    username: payload.email,
    password: payload.password,
  });

  try {
    const { data } = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          accept: 'application/json',
        },
      }
    );
    return data;
  } catch (error: any) {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message || 
                   error.response?.statusText || 
                   error.message || 
                   'Login failed';
    throw new Error(message);
  }
}