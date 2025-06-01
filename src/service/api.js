import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hotelcost.somee.com/api',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Timeout: El servidor no respondió a tiempo' });
    }
    return Promise.reject(error);
  }
);

export default api;