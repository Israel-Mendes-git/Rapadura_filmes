import axios from 'axios';

// Detecta se está em produção ou desenvolvimento
const isProduction = import.meta.env.PROD;

// Em produção, usa o domínio; em desenvolvimento, usa localhost
const API_URL = isProduction ? 'https://filmerama.com.br/api' : 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;