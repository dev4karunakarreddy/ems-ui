// services/api.ts
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create regular axios instance for login (no interceptors)
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Create nextaxios with interceptors for authenticated requests
const nextaxios = axios.create({
  baseURL,
  withCredentials: true,
});

const getCookie = (name: string): string | undefined => {
  if (typeof window === 'undefined') return;
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1];
};

const clearAuthCookies = () => {
  document.cookie = 'token=; Max-Age=0; path=/;';
  document.cookie = 'role=; Max-Age=0; path=/;';
};

nextaxios.interceptors.request.use(config => {
  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

nextaxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearAuthCookies();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default nextaxios;