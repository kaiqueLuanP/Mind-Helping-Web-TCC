// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.11.185.214:3334',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições (quando tiver autenticação)
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

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;