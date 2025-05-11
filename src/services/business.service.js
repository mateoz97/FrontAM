// src/services/business.service.js
import api from './api';

const businessService = {
  async getUserBusinesses() {
    try {
      const response = await api.get('/business/user-businesses/');
      return response.data;
    } catch (error) {
      console.error('Error getting user businesses:', error);
      return [];
    }
  },

  async getBusinessById(id) {
    const response = await api.get(`/business/${id}/`);
    return response.data;
  }
};

export default businessService;