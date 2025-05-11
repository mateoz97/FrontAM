import api from './api';

const authService = {
  async login(credentials) {
    // CAMBIO 4: Verificamos el backend Django para login personalizado
    const response = await api.post('/accounts/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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