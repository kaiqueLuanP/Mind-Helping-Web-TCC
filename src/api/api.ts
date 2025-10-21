// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ApiErrorResponse {
  message: string;
  [key: string]: any;
}

interface CustomError extends Error {
  response?: {
    data: ApiErrorResponse;
    status: number;
    [key: string]: any;
  };
  status?: number;
  responseData?: ApiErrorResponse;
}

const api = axios.create({
  baseURL: 'https://mind-helping-api.fly.dev',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  timeoutErrorMessage: 'Tempo limite excedido',
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  }
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
  (response) => {
    if (response.status !== 204 && !response.data) {
      throw new Error('Resposta vazia do servidor');
    }
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    let message = 'Erro na requisição';

    if (error.code === 'ECONNABORTED') {
      message = 'Tempo limite excedido. O servidor está demorando para responder.';
    } else if (!error.response && error.message.includes('Network Error')) {
      message = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    } else if (error.response?.status === 401) {
      message = 'Email ou senha incorretos';
    } else if (error.response?.status === 404) {
      message = 'Recurso não encontrado no servidor';
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    const customError = new Error(message) as CustomError;
    if (error.response) {
      customError.response = error.response;
      customError.status = error.response.status;
      customError.responseData = error.response.data;
    }

    return Promise.reject(customError);
  }
);

export default api;