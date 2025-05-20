// src/services/auth.service.js
import api from './api';

const authService = {
  async login(credentials) {
    // Actualizar el login para usar el formato correcto
    const response = await api.post('/accounts/login/', {
      identifier: credentials.username,
      password: credentials.password
    });
    
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Configurar el token en los headers de axios
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/accounts/register/', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName
    });
    
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Configurar el token en los headers de axios
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    return response.data;
  },

  async createBusiness(businessData) {
    const response = await api.post('/business/', businessData);
    return response.data;
  },

  async joinBusinessRequest(businessId) {
    const response = await api.post('/business/join-business-request/', {
      business: businessId
    });
    return response.data;
  },

  async getBusinesses(search = '') {
    const response = await api.get('/business/', {
      params: { search }
    });
    return response.data;
  },

  async getUserInfo() {
    const response = await api.get('/accounts/user-info/');
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async updateUserProfile(userData) {
    try {
      console.log('Updating user profile with data:', userData);
      const response = await api.patch('/accounts/user-profile/', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

export default authService;