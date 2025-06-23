// src/services/auth.service.js
import api from './api';

const authService = {
  async login(credentials) {
    console.log('Auth service login called with:', credentials);
    
    // Actualizar el login para usar el formato correcto
    const loginData = {
      identifier: credentials.username || credentials.identifier,
      password: credentials.password
    };
    
    console.log('Sending login data to API:', loginData);
    
    const response = await api.post('/accounts/login/', loginData);
    
    console.log('Login API response:', response.data);
    
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Stored user data:', response.data.user);
      
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

  // =================== TOKEN MANAGEMENT ===================

  /**
   * Obtiene un nuevo token de acceso usando el refresh token
   * @returns {Promise<Object>} Nuevos tokens
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('Refreshing access token...');
      const response = await api.post('/accounts/token/refresh/', {
        refresh: refreshToken
      });

      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        
        // Si también viene un nuevo refresh token, actualizarlo
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh);
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Si falla el refresh, hacer logout
      this.logout();
      throw error;
    }
  },

  /**
   * Obtiene un token usando el endpoint token/obtain
   * @param {Object} credentials - Credenciales de login
   * @returns {Promise<Object>} Tokens
   */
  async obtainToken(credentials) {
    try {
      console.log('Obtaining token with credentials:', credentials);
      const response = await api.post('/accounts/token/', {
        username: credentials.username || credentials.identifier,
        password: credentials.password
      });

      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      }

      return response.data;
    } catch (error) {
      console.error('Error obtaining token:', error);
      throw error;
    }
  },

  // =================== BUSINESS PROFILE MANAGEMENT ===================

  /**
   * Obtiene los perfiles de negocio del usuario
   * @returns {Promise<Array>} Lista de perfiles de negocio
   */
  async getBusinessProfiles() {
    try {
      console.log('Getting business profiles...');
      const response = await api.get('/accounts/profiles/');
      console.log('Business profiles obtained:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error getting business profiles:', error);
      return [];
    }
  },

  /**
   * Cambia al perfil de negocio especificado
   * @param {number} profileId - ID del perfil de negocio
   * @returns {Promise<Object>} Resultado del cambio
   */
  async switchBusinessProfile(profileId) {
    try {
      console.log(`Switching to business profile ${profileId}...`);
      const response = await api.post('/accounts/profiles/switch/', {
        profile_id: profileId
      });
      console.log('Business profile switched:', response.data);
      
      // Actualizar información del usuario si viene en la respuesta
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error switching business profile:', error);
      throw error;
    }
  },

  /**
   * Obtiene el perfil de negocio actual
   * @returns {Promise<Object>} Perfil de negocio actual
   */
  async getCurrentBusinessProfile() {
    try {
      console.log('Getting current business profile...');
      const response = await api.get('/accounts/profiles/current/');
      console.log('Current business profile:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting current business profile:', error);
      throw error;
    }
  },

  /**
   * Crea un post desde el perfil de negocio
   * @param {Object} postData - Datos del post
   * @returns {Promise<Object>} Post creado
   */
  async createBusinessPost(postData) {
    try {
      console.log('Creating business post:', postData);
      
      // Determinar si es FormData o un objeto regular
      const isFormData = postData instanceof FormData;
      let data;
      
      if (isFormData) {
        data = postData;
      } else {
        // Crear FormData si hay archivos
        if (postData.image || postData.video) {
          data = new FormData();
          if (postData.content) data.append('content', postData.content);
          if (postData.image) data.append('image', postData.image);
          if (postData.video) data.append('video', postData.video);
        } else {
          data = { content: postData.content };
        }
      }
      
      const config = isFormData || postData.image || postData.video ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      
      const response = await api.post('/accounts/profiles/create-post/', data, config);
      console.log('Business post created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating business post:', error);
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