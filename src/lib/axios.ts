import axios from "axios";

export const api = axios.create({
    baseURL: "https://mind-helping-api.fly.dev",
    timeout: 5000, // 5 segundos de timeout
    headers: {
        'Content-Type': 'application/json',
    }
})

// Interceptor para tratar erros
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Timeout na requisição:', error)
        }
        return Promise.reject(error)
    }
)
