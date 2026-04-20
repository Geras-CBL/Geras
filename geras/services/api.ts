import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';

const api = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;
