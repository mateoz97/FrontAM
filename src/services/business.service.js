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
        } catch {
          console.log('Formato 1 falló, intentando formato 2...');
          try {
            // Formato 2: Objeto con business_id
            response = await api.post('/business/switch-business/', { business_id: parseInt(businessId) });
          } catch {
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

  // =================== BUSINESS INVITATIONS ===================

  /**
   * Crea una invitación para unirse al negocio
   * @param {Object} invitationData - Datos de la invitación {email, role, message}
   * @returns {Promise<Object>} Invitación creada
   */
  async createInvitation(invitationData) {
    try {
      console.log('Creando invitación:', invitationData);
      const response = await api.post('/business/invitations/create/', invitationData);
      console.log('Invitación creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear invitación:', error);
      throw error;
    }
  },

  /**
   * Utiliza una invitación para unirse al negocio
   * @param {string} invitationCode - Código de la invitación
   * @returns {Promise<Object>} Resultado de usar la invitación
   */
  async useInvitation(invitationCode) {
    try {
      console.log(`Usando invitación: ${invitationCode}`);
      const response = await api.post('/business/invitations/use/', {
        invitation_code: invitationCode
      });
      console.log('Invitación utilizada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al usar invitación:', error);
      throw error;
    }
  },

  /**
   * Obtiene lista de invitaciones del negocio
   * @returns {Promise<Array>} Lista de invitaciones
   */
  async getInvitations() {
    try {
      console.log('Obteniendo invitaciones...');
      const response = await api.get('/business/invitations/list/');
      console.log('Invitaciones obtenidas:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener invitaciones:', error);
      return [];
    }
  },

  // =================== BUSINESS REQUESTS ===================

  /**
   * Obtiene solicitudes de unión al negocio
   * @returns {Promise<Array>} Lista de solicitudes
   */
  async getBusinessRequests() {
    try {
      console.log('Obteniendo solicitudes de negocio...');
      const response = await api.get('/business/business-requests/');
      console.log('Solicitudes obtenidas:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      return [];
    }
  },

  /**
   * Aprueba una solicitud de unión al negocio
   * @param {number} requestId - ID de la solicitud
   * @returns {Promise<Object>} Resultado de la operación
   */
  async approveBusinessRequest(requestId) {
    try {
      console.log(`Aprobando solicitud ${requestId}...`);
      const response = await api.patch(`/business/business-requests/${requestId}/`, {
        status: 'approved'
      });
      console.log('Solicitud aprobada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al aprobar solicitud ${requestId}:`, error);
      throw error;
    }
  },

  /**
   * Rechaza una solicitud de unión al negocio
   * @param {number} requestId - ID de la solicitud
   * @param {string} reason - Razón del rechazo (opcional)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async rejectBusinessRequest(requestId, reason = '') {
    try {
      console.log(`Rechazando solicitud ${requestId}...`);
      const updateData = { status: 'rejected' };
      if (reason) {
        updateData.rejection_reason = reason;
      }
      
      const response = await api.patch(`/business/business-requests/${requestId}/`, updateData);
      console.log('Solicitud rechazada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al rechazar solicitud ${requestId}:`, error);
      throw error;
    }
  },

  // =================== BUSINESS JOINING ===================

  /**
   * Se une directamente a un negocio (diferente de enviar solicitud)
   * @param {number} businessId - ID del negocio
   * @returns {Promise<Object>} Resultado de la operación
   */
  async joinBusiness(businessId) {
    try {
      console.log(`Uniéndose al negocio ${businessId}...`);
      const response = await api.post('/business/join-business/', {
        business_id: businessId
      });
      console.log('Unión exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al unirse al negocio ${businessId}:`, error);
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
  },

  // =================== USER MANAGEMENT ===================

  /**
   * Obtiene los usuarios de un negocio
   * @returns {Promise<Array>} Lista de usuarios del negocio
   */
  async getBusinessUsers() {
    try {
      console.log('Obteniendo usuarios del negocio...');
      const response = await api.get('/business/users/');
      console.log('Usuarios del negocio obtenidos:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener usuarios del negocio:', error);
      return [];
    }
  },

  /**
   * Obtiene las solicitudes de unión al negocio
   * @returns {Promise<Array>} Lista de solicitudes pendientes
   */
  async getJoinRequests() {
    try {
      console.log('Obteniendo solicitudes de unión...');
      const response = await api.get('/business/join-requests/');
      console.log('Solicitudes obtenidas:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener solicitudes de unión:', error);
      return [];
    }
  },

  /**
   * Invita a un usuario al negocio
   * @param {Object} inviteData - Datos de la invitación {email, role_id, message}
   * @returns {Promise<Object>} Resultado de la invitación
   */
  async inviteUser(inviteData) {
    try {
      console.log('Enviando invitación de usuario:', inviteData);
      const response = await api.post('/business/invite-user/', inviteData);
      console.log('Invitación enviada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al enviar invitación:', error);
      throw error;
    }
  },

  /**
   * Actualiza la información de un usuario del negocio
   * @param {number} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateBusinessUser(userId, userData) {
    try {
      console.log(`Actualizando usuario ${userId}:`, userData);
      const response = await api.patch(`/business/users/${userId}/`, userData);
      console.log('Usuario actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar usuario ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Aprueba una solicitud de unión al negocio
   * @param {number} requestId - ID de la solicitud
   * @returns {Promise<Object>} Resultado de la operación
   */
  async approveJoinRequest(requestId) {
    try {
      console.log(`Aprobando solicitud ${requestId}...`);
      const response = await api.post(`/business/approve-request/${requestId}/`);
      console.log('Solicitud aprobada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al aprobar solicitud ${requestId}:`, error);
      throw error;
    }
  },

  /**
   * Rechaza una solicitud de unión al negocio
   * @param {number} requestId - ID de la solicitud
   * @returns {Promise<Object>} Resultado de la operación
   */
  async rejectJoinRequest(requestId) {
    try {
      console.log(`Rechazando solicitud ${requestId}...`);
      const response = await api.post(`/business/reject-request/${requestId}/`);
      console.log('Solicitud rechazada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al rechazar solicitud ${requestId}:`, error);
      throw error;
    }
  },

  /**
   * Remueve un usuario del negocio
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} Resultado de la operación
   */
  async removeUserFromBusiness(userId) {
    try {
      console.log(`Removiendo usuario ${userId} del negocio...`);
      const response = await api.delete(`/business/users/${userId}/`);
      console.log('Usuario removido del negocio');
      return response.data;
    } catch (error) {
      console.error(`Error al remover usuario ${userId}:`, error);
      throw error;
    }
  },

  // =================== BUSINESS DELETION & SCHEMA MANAGEMENT ===================

  /**
   * Obtiene el estado del esquema de un negocio
   * @param {number} businessId - ID del negocio
   * @returns {Promise<Object>} Información del estado del esquema
   */
  async getSchemaStatus(businessId) {
    try {
      console.log(`Obteniendo estado del esquema para negocio ${businessId}...`);
      const response = await api.get(`/business/${businessId}/schema-status/`);
      console.log('Estado del esquema obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener estado del esquema para negocio ${businessId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un negocio de forma segura
   * @param {number} businessId - ID del negocio a eliminar
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteBusiness(businessId) {
    try {
      console.log(`Eliminando negocio ${businessId}...`);
      const response = await api.delete(`/business/${businessId}/`);
      console.log('Negocio eliminado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar negocio ${businessId}:`, error);
      throw error;
    }
  },

  /**
   * Verifica la integridad del esquema de un negocio
   * @param {number} businessId - ID del negocio
   * @returns {Promise<Object>} Resultado de la verificación
   */
  async verifySchemaIntegrity(businessId) {
    try {
      console.log(`Verificando integridad del esquema para negocio ${businessId}...`);
      const response = await api.post(`/business/${businessId}/verify-schema/`);
      console.log('Verificación de integridad completada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al verificar integridad del esquema para negocio ${businessId}:`, error);
      throw error;
    }
  },

  /**
   * Limpia esquemas huérfanos del sistema
   * @returns {Promise<Object>} Resultado de la limpieza
   */
  async cleanupOrphanedSchemas() {
    try {
      console.log('Iniciando limpieza de esquemas huérfanos...');
      const response = await api.post('/business/cleanup-orphaned-schemas/');
      console.log('Limpieza de esquemas completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al limpiar esquemas huérfanos:', error);
      throw error;
    }
  },

  /**
   * Obtiene logs de mantenimiento del sistema
   * @param {Object} filters - Filtros opcionales (date_from, date_to, level)
   * @returns {Promise<Array>} Lista de logs
   */
  async getMaintenanceLogs(filters = {}) {
    try {
      console.log('Obteniendo logs de mantenimiento...', filters);
      const response = await api.get('/business/maintenance-logs/', {
        params: filters
      });
      console.log('Logs de mantenimiento obtenidos:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener logs de mantenimiento:', error);
      return [];
    }
  },

  // =================== BUSINESS TYPES ===================

  /**
   * Obtiene los tipos de negocio disponibles
   * @returns {Promise<Array>} Lista de tipos de negocio
   */
  async getBusinessTypes() {
    try {
      console.log('Obteniendo tipos de negocio...');
      const response = await api.get('/business/types/');
      console.log('Tipos de negocio obtenidos:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener tipos de negocio:', error);
      return [];
    }
  },

  /**
   * Obtiene la configuración específica de un tipo de negocio
   * @param {string} businessType - Tipo de negocio
   * @returns {Promise<Object>} Configuración del tipo de negocio
   */
  async getBusinessTypeConfig(businessType) {
    try {
      console.log(`Obteniendo configuración para tipo de negocio: ${businessType}`);
      const response = await api.get(`/business/types/${businessType}/config/`);
      console.log('Configuración obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener configuración para ${businessType}:`, error);
      return {};
    }
  },

  /**
   * Actualiza el tipo de negocio
   * @param {number} businessId - ID del negocio
   * @param {string} businessType - Nuevo tipo de negocio
   * @returns {Promise<Object>} Negocio actualizado
   */
  async updateBusinessType(businessId, businessType) {
    try {
      console.log(`Actualizando tipo de negocio ${businessId} a ${businessType}`);
      const response = await api.patch(`/business/${businessId}/`, {
        business_type: businessType
      });
      console.log('Tipo de negocio actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar tipo de negocio:`, error);
      throw error;
    }
  },

  /**
   * Obtiene las características disponibles según el tipo de negocio
   * @param {string} businessType - Tipo de negocio
   * @returns {Promise<Object>} Características disponibles
   */
  async getBusinessTypeFeatures(businessType) {
    try {
      console.log(`Obteniendo características para tipo: ${businessType}`);
      const response = await api.get(`/business/types/${businessType}/features/`);
      console.log('Características obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener características para ${businessType}:`, error);
      return {
        hasOrders: false,
        hasInventory: false,
        hasReservations: false,
        hasMenus: false,
        modules: []
      };
    }
  },

  /**
   * Configura los módulos activos para un negocio
   * @param {number} businessId - ID del negocio
   * @param {Array} modules - Lista de módulos a activar
   * @returns {Promise<Object>} Configuración actualizada
   */
  async updateBusinessModules(businessId, modules) {
    try {
      console.log(`Actualizando módulos para negocio ${businessId}:`, modules);
      const response = await api.patch(`/business/${businessId}/modules/`, {
        active_modules: modules
      });
      console.log('Módulos actualizados:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar módulos del negocio:`, error);
      throw error;
    }
  },

  /**
   * Obtiene plantillas de configuración para tipos de negocio
   * @param {string} businessType - Tipo de negocio
   * @returns {Promise<Object>} Plantilla de configuración
   */
  async getBusinessTemplate(businessType) {
    try {
      console.log(`Obteniendo plantilla para tipo: ${businessType}`);
      const response = await api.get(`/business/templates/${businessType}/`);
      console.log('Plantilla obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener plantilla para ${businessType}:`, error);
      return {};
    }
  },

  /**
   * Aplica una plantilla de configuración a un negocio
   * @param {number} businessId - ID del negocio
   * @param {string} templateType - Tipo de plantilla
   * @returns {Promise<Object>} Resultado de la aplicación
   */
  async applyBusinessTemplate(businessId, templateType) {
    try {
      console.log(`Aplicando plantilla ${templateType} al negocio ${businessId}`);
      const response = await api.post(`/business/${businessId}/apply-template/`, {
        template_type: templateType
      });
      console.log('Plantilla aplicada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al aplicar plantilla:`, error);
      throw error;
    }
  },

  // =================== BUSINESS STATISTICS ===================

  /**
   * Obtiene estadísticas del negocio
   * @returns {Promise<Object>} Estadísticas del negocio
   */
  async getBusinessStats() {
    try {
      console.log('Obteniendo estadísticas del negocio...');
      const response = await api.get('/business/stats/');
      console.log('Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del negocio:', error);
      return {
        total_orders: 0,
        active_users: 0,
        revenue: 0,
        pending_requests: 0
      };
    }
  },

  /**
   * Obtiene el reporte de actividad del negocio
   * @param {Object} params - Parámetros del reporte (period, date_from, date_to)
   * @returns {Promise<Object>} Reporte de actividad
   */
  async getActivityReport(params = {}) {
    try {
      console.log('Obteniendo reporte de actividad...', params);
      const response = await api.get('/business/activity-report/', {
        params
      });
      console.log('Reporte de actividad obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte de actividad:', error);
      return {
        period: params.period || 'day',
        total_activity: 0,
        user_activity: [],
        order_activity: [],
        peak_hours: []
      };
    }
  }
};

// IMPORTANTE: Exportación por defecto
export default businessService;