// src/services/business.service.js
import api from './api';

/**
 * Servicio para gestionar operaciones relacionadas con negocios
 */
const businessService = {
  /**
   * Obtiene los negocios del usuario actual
   * @returns {Promise<Array>} Lista de negocios
   */
  async getUserBusinesses() {
    try {
      console.log('Obteniendo negocios del usuario...');
      const response = await api.get('/business/user-businesses/');
      console.log('Negocios obtenidos:', response.data);
      
      // Si la respuesta no es un array, intentar extraer los datos
      if (response.data && !Array.isArray(response.data)) {
        // A veces la API devuelve {results: [...]} o {data: [...]}
        if (response.data.results) return response.data.results;
        if (response.data.data) return response.data.data;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener negocios del usuario:', error);
      // En caso de error, devolver array vacío
      return [];
    }
  },

  /**
   * Obtiene información detallada de un negocio por su ID
   * @param {number} id - ID del negocio
   * @returns {Promise<Object>} Detalles del negocio
   */
  async getBusinessById(id) {
    try {
      console.log(`Obteniendo detalles del negocio ID: ${id}`);
      const response = await api.get(`/business/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener negocio ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Crea un nuevo negocio
   * @param {Object} businessData - Datos del negocio a crear
   * @returns {Promise<Object>} Negocio creado
   */
  async createBusiness(businessData) {
    try {
      console.log('Creando negocio con datos:', businessData);
      const response = await api.post('/business/', businessData);
      return response.data;
    } catch (error) {
      console.error('Error al crear negocio:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza un negocio existente
   * @param {number} id - ID del negocio
   * @param {Object} businessData - Datos a actualizar
   * @returns {Promise<Object>} Negocio actualizado
   */
  async updateBusiness(id, businessData) {
    try {
      console.log(`Actualizando negocio ID ${id} con datos:`, businessData);
      const response = await api.patch(`/business/${id}/`, businessData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar negocio ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Cambia el negocio activo del usuario
   * @param {number} businessId - ID del negocio a activar
   * @returns {Promise<Object>} Resultado de la operación
   */
  async switchBusiness(businessId) {
    try {
      console.log(`Cambiando al negocio ID: ${businessId}`);
      const response = await api.post('/business/switch-business/', { business_id: businessId });
      return response.data;
    } catch (error) {
      console.error(`Error al cambiar al negocio ID ${businessId}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtiene la lista de sucursales de un negocio
   * @param {number} businessId - ID del negocio principal
   * @returns {Promise<Array>} Lista de sucursales
   */
  async getBranches(businessId) {
    try {
      console.log(`Obteniendo sucursales del negocio ID: ${businessId}`);
      const response = await api.get(`/business/${businessId}/branches/`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener sucursales del negocio ID ${businessId}:`, error);
      return [];
    }
  }
};

export default businessService;