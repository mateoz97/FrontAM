// src/services/api.js
import axios from 'axios';
import { API_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_URL || 'http://localhost:8000/api', // Valor predeterminado por si falta la constante
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 segundos
});

// Interceptor para tokens
api.interceptors.request.use(
  (config) => {
    // Añadir información de depuración
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para errores
api.interceptors.response.use(
  (response) => {
    // Añadir información de depuración
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error('API Response Error:', error.response || error);
    
    // Si no hay respuesta del servidor
    if (!error.response) {
      console.error('No server response, possibly a network error');
      // Mostrar en consola mas información para depuración
      console.error('Error details:', error);
      return Promise.reject(new Error('Error de red - No se pudo conectar al servidor'));
    }
    
    // Si es un error de autenticación (401)
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.log('Unauthorized error - clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Intentar renovar el token si tenemos refreshToken
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          console.log('Attempting to refresh token...');
          const response = await axios.post(`${API_URL}/accounts/token/refresh/`, {
            refresh: refreshToken
          });
          
          if (response.data && response.data.access) {
            console.log('Token refreshed successfully');
            // Guardar el nuevo token
            localStorage.setItem('token', response.data.access);
            
            // Reintentar la solicitud original
            const config = error.config;
            config.headers.Authorization = `Bearer ${response.data.access}`;
            return api(config);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Redirigir al login si el refresh falla
          window.location.href = '/login';
        }
      } else {
        // Si no hay refreshToken, redirigir al login
        window.location.href = '/login';
      }
    }
    
    // Error 404 - Recurso no encontrado
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.config.url);
      return Promise.reject(new Error(`Recurso no encontrado: ${error.config.url}`));
    }
    
    // Error 500 - Error del servidor
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('Error del servidor - Intente más tarde'));
    }
    
    return Promise.reject(error);
  }
);

export default api;