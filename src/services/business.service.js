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
      
      // Verificar que la respuesta sea un array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      } else {
        console.warn('Formato de respuesta inesperado:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener negocios del usuario:', error);
      
      // Si es un error 404, es probable que no hay endpoint
      if (error.response?.status === 404) {
        console.error('El endpoint user-businesses no existe. Verificar configuración de URLs.');
      }
      
      // En caso de error, devolver array vacío para no romper la aplicación
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
      
      // Verificar que businessId sea válido
      if (!businessId || isNaN(businessId)) {
        throw new Error('ID de negocio inválido');
      }
      
      // Asegurar que se envíe como número
      const requestData = { 
        business_id: parseInt(businessId) 
      };
      
      console.log('Datos a enviar:', requestData);
      
      const response = await api.post('/business/switch-business/', requestData);
      
      console.log('Respuesta del servidor:', response.data);
      return response.data;
      
    } catch (error) {
      console.error(`Error al cambiar al negocio ID ${businessId}:`, error);
      
      // Logging más detallado del error
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      throw error;
    }
  },
  
  /**
   * Envía una solicitud para unirse a un negocio
   * @param {number} businessId - ID del negocio al que unirse
   * @param {string} message - Mensaje opcional para la solicitud
   * @returns {Promise<Object>} Resultado de la operación
   */
  async joinBusinessRequest(businessId, message = '') {
    try {
      console.log(`Enviando solicitud para unirse al negocio ID: ${businessId}`);
      const response = await api.post('/business/join-business-request/', {
        business: businessId,
        message: message
      });
      return response.data;
    } catch (error) {
      console.error(`Error al enviar solicitud para unirse al negocio ID ${businessId}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtiene lista de solicitudes pendientes del usuario
   * @returns {Promise<Array>} Lista de solicitudes
   */
  async getUserJoinRequests() {
    try {
      console.log('Obteniendo solicitudes pendientes del usuario...');
      const response = await api.get('/business/join-business-request/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener solicitudes pendientes:', error);
      return [];
    }
  },
  
  /**
   * Abandona el negocio actual
   * @returns {Promise<Object>} Resultado de la operación
   */
  async leaveBusiness() {
    try {
      console.log('Abandonando negocio actual...');
      const response = await api.post('/business/leave-business/');
      return response.data;
    } catch (error) {
      console.error('Error al abandonar negocio:', error);
      throw error;
    }
  },
  
  /**
   * Busca negocios por nombre
   * @param {string} query - Texto a buscar
   * @returns {Promise<Array>} Lista de negocios encontrados
   */
  async searchBusinesses(query) {
    try {
      console.log(`Buscando negocios con: "${query}"`);
      const response = await api.get('/business/', {
        params: { search: query }
      });
      
      // Manejar diferentes formatos de respuesta
      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (response.data.results) {
          return response.data.results;
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error al buscar negocios:', error);
      return [];
    }
  }
};

// IMPORTANTE: Exportación por defecto
export default businessService;