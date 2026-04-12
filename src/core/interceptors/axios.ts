import axios from 'axios';
import { toast } from 'vue-sonner';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    toast.error('Request failed. Please try again.');
    throw error;
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      toast.warning('Session expired. Please login again.');
      globalThis.location.href = '/login';
    } else {
      const message = error.response?.data?.message || 'Something went wrong.';
      toast.error(message);
    }

    throw error;
  },
);
