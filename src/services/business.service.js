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

      // Primero obtener los negocios del usuario para verificar si solo tiene uno
      const userBusinesses = await this.getUserBusinesses();
      console.log('User businesses for switch:', userBusinesses);

      // Si el usuario solo tiene un negocio y es el que intenta activar,
      // retornar éxito sin llamar al endpoint (ya está activo por defecto)
      if (userBusinesses.length === 1 && userBusinesses[0].id === parseInt(businessId)) {
        console.log('Usuario solo tiene un negocio, activando directamente sin switch-business');
        return {
          success: true,
          message: 'Negocio activado (único negocio del usuario)',
          business_id: parseInt(businessId),
          business: userBusinesses[0]
        };
      }

      // Si tiene múltiples negocios, usar el endpoint normal
      if (userBusinesses.length > 1) {
        console.log('Usuario tiene múltiples negocios, usando switch-business endpoint');
        
        // Intentar diferentes formatos de datos
        let response;
        try {
          // Formato 1: Solo el número
          response = await api.post('/business/switch-business/', parseInt(businessId));
        } catch (error1) {
          console.log('Formato 1 falló, intentando formato 2...');
          try {
            // Formato 2: Objeto con business_id
            response = await api.post('/business/switch-business/', { business_id: parseInt(businessId) });
          } catch (error2) {
            console.log('Formato 2 falló, intentando formato 3...');
            // Formato 3: Objeto con id
            response = await api.post('/business/switch-business/', { id: parseInt(businessId) });
          }
        }
        
        console.log('Respuesta del servidor:', response.data);
        return response.data;
      }

      // Si no tiene negocios, error
      if (userBusinesses.length === 0) {
        throw new Error('El usuario no tiene negocios asignados');
      }

    } catch (error) {
      console.error(`Error al cambiar al negocio ID ${businessId}:`, error);
      
      // Si es un error porque el usuario solo tiene un negocio y el endpoint no existe/falla
      // intentar obtener los negocios y verificar si el businessId coincide
      try {
        console.log('Verificando si es error de negocio único...');
        const userBusinesses = await this.getUserBusinesses();
        
        if (userBusinesses.length === 1 && userBusinesses[0].id === parseInt(businessId)) {
          console.log('Fallback: activando negocio único sin endpoint');
          return {
            success: true,
            message: 'Negocio activado (fallback para negocio único)',
            business_id: parseInt(businessId),
            business: userBusinesses[0]
          };
        }
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
      }
      
      // Logging más detallado del error original
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
   * Activa automáticamente el negocio del usuario sin usar switch-business
   * Útil para casos donde el usuario solo tiene un negocio
   * @returns {Promise<Object>} Información del negocio activado
   */
  async activateUserBusiness() {
    try {
      console.log('Activando negocio del usuario automáticamente...');
      
      const userBusinesses = await this.getUserBusinesses();
      console.log('Negocios del usuario:', userBusinesses);
      
      if (userBusinesses.length === 0) {
        throw new Error('El usuario no tiene negocios asignados');
      }
      
      // Si solo tiene un negocio, activarlo directamente
      if (userBusinesses.length === 1) {
        const business = userBusinesses[0];
        console.log('Activando negocio único:', business);
        
        return {
          success: true,
          message: 'Negocio activado automáticamente',
          business_id: business.id,
          business: business,
          isOwner: business.isOwner || business.role === 'Owner',
          role: business.role
        };
      }
      
      // Si tiene múltiples negocios, buscar el primero donde sea owner
      const ownerBusiness = userBusinesses.find(b => b.isOwner === true || b.role === 'Owner');
      const businessToActivate = ownerBusiness || userBusinesses[0];
      
      console.log('Activando negocio (múltiples disponibles):', businessToActivate);
      
      return {
        success: true,
        message: 'Negocio activado automáticamente',
        business_id: businessToActivate.id,
        business: businessToActivate,
        isOwner: businessToActivate.isOwner || businessToActivate.role === 'Owner',
        role: businessToActivate.role
      };
      
    } catch (error) {
      console.error('Error activando negocio automáticamente:', error);
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