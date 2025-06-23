// src/services/roles.service.js
import api from './api';

const rolesService = {
  // =================== ROLE MANAGEMENT ===================

  /**
   * Obtiene todos los roles del negocio
   * @returns {Promise<Array>} Lista de roles
   */
  async getRoles() {
    try {
      console.log('Obteniendo roles...');
      const response = await api.get('/roles/roles/');
      console.log('Roles obtenidos:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener roles:', error);
      return [];
    }
  },

  /**
   * Obtiene un rol específico por ID
   * @param {number} roleId - ID del rol
   * @returns {Promise<Object>} Datos del rol
   */
  async getRole(roleId) {
    try {
      console.log(`Obteniendo rol ${roleId}...`);
      const response = await api.get(`/roles/roles/${roleId}/`);
      console.log('Rol obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener rol ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo rol
   * @param {Object} roleData - Datos del rol
   * @returns {Promise<Object>} Rol creado
   */
  async createRole(roleData) {
    try {
      console.log('Creando rol:', roleData);
      const response = await api.post('/roles/roles/', roleData);
      console.log('Rol creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear rol:', error);
      throw error;
    }
  },

  /**
   * Actualiza un rol existente
   * @param {number} roleId - ID del rol
   * @param {Object} roleData - Datos a actualizar
   * @returns {Promise<Object>} Rol actualizado
   */
  async updateRole(roleId, roleData) {
    try {
      console.log(`Actualizando rol ${roleId}:`, roleData);
      const response = await api.patch(`/roles/roles/${roleId}/`, roleData);
      console.log('Rol actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar rol ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un rol
   * @param {number} roleId - ID del rol
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteRole(roleId) {
    try {
      console.log(`Eliminando rol ${roleId}...`);
      const response = await api.delete(`/roles/roles/${roleId}/`);
      console.log('Rol eliminado');
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar rol ${roleId}:`, error);
      throw error;
    }
  },

  // =================== ROLE ASSIGNMENT ===================

  /**
   * Asigna un rol a un usuario
   * @param {Object} assignmentData - Datos de asignación {user_id, role_id}
   * @returns {Promise<Object>} Resultado de la asignación
   */
  async assignRole(assignmentData) {
    try {
      console.log('Asignando rol:', assignmentData);
      const response = await api.post('/roles/assign-role/', assignmentData);
      console.log('Rol asignado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al asignar rol:', error);
      throw error;
    }
  },

  /**
   * Remueve un rol de un usuario
   * @param {Object} removeData - Datos para remover {user_id, role_id}
   * @returns {Promise<Object>} Resultado de la operación
   */
  async removeRole(removeData) {
    try {
      console.log('Removiendo rol:', removeData);
      const response = await api.delete('/roles/assign-role/', {
        data: removeData
      });
      console.log('Rol removido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al remover rol:', error);
      throw error;
    }
  },

  // =================== PERMISSIONS MANAGEMENT ===================

  /**
   * Obtiene los permisos de un usuario
   * @param {number} userId - ID del usuario (opcional, por defecto usuario actual)
   * @returns {Promise<Object>} Permisos del usuario
   */
  async getUserPermissions(userId = null) {
    try {
      console.log(`Obteniendo permisos del usuario ${userId || 'actual'}...`);
      const url = userId ? `/roles/permissions/?user_id=${userId}` : '/roles/permissions/';
      const response = await api.get(url);
      console.log('Permisos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      return {};
    }
  },

  /**
   * Actualiza los permisos de un rol
   * @param {number} roleId - ID del rol
   * @param {Object} permissions - Objeto con permisos
   * @returns {Promise<Object>} Rol actualizado
   */
  async updateRolePermissions(roleId, permissions) {
    try {
      console.log(`Actualizando permisos del rol ${roleId}:`, permissions);
      const response = await api.patch(`/roles/roles/${roleId}/permissions/`, {
        permissions
      });
      console.log('Permisos actualizados:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar permisos del rol ${roleId}:`, error);
      throw error;
    }
  },

  // =================== ROLE TEMPLATES ===================

  /**
   * Obtiene plantillas de roles disponibles
   * @returns {Promise<Array>} Lista de plantillas
   */
  async getRoleTemplates() {
    try {
      console.log('Obteniendo plantillas de roles...');
      const response = await api.get('/roles/templates/');
      console.log('Plantillas obtenidas:', response.data);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.results) {
        return response.data.results;
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener plantillas:', error);
      return [];
    }
  },

  /**
   * Crea un rol desde una plantilla
   * @param {Object} templateData - Datos de la plantilla {template_name, role_name, description}
   * @returns {Promise<Object>} Rol creado
   */
  async createRoleFromTemplate(templateData) {
    try {
      console.log('Creando rol desde plantilla:', templateData);
      const response = await api.post('/roles/create-from-template/', templateData);
      console.log('Rol creado desde plantilla:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear rol desde plantilla:', error);
      throw error;
    }
  },

  // =================== ROLE MANAGEMENT (BUSINESS CONTEXT) ===================

  /**
   * Obtiene la gestión de roles del negocio
   * @returns {Promise<Object>} Información de gestión de roles
   */
  async getBusinessRoleManagement() {
    try {
      console.log('Obteniendo gestión de roles del negocio...');
      const response = await api.get('/roles/management/');
      console.log('Gestión de roles obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener gestión de roles:', error);
      return {};
    }
  },

  /**
   * Actualiza la gestión de un rol específico
   * @param {number} roleId - ID del rol
   * @param {Object} managementData - Datos de gestión
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async updateRoleManagement(roleId, managementData) {
    try {
      console.log(`Actualizando gestión del rol ${roleId}:`, managementData);
      const response = await api.patch(`/roles/management/${roleId}/`, managementData);
      console.log('Gestión actualizada:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar gestión del rol ${roleId}:`, error);
      throw error;
    }
  },

  // =================== UTILITY METHODS ===================

  /**
   * Verifica si el usuario actual tiene un permiso específico
   * @param {string} permission - Nombre del permiso
   * @returns {Promise<boolean>} True si tiene el permiso
   */
  async hasPermission(permission) {
    try {
      const permissions = await this.getUserPermissions();
      return permissions[permission] === true;
    } catch (error) {
      console.error('Error al verificar permiso:', error);
      return false;
    }
  },

  /**
   * Obtiene todos los permisos disponibles en el sistema
   * @returns {Array} Lista de permisos disponibles
   */
  getAvailablePermissions() {
    return [
      'can_view_dashboard',
      'can_view_orders',
      'can_manage_orders',
      'can_view_inventory',
      'can_manage_inventory',
      'can_view_users',
      'can_manage_users',
      'can_view_reports',
      'can_manage_settings',
      'can_view_finances',
      'can_manage_roles',
      'can_invite_users',
      'can_remove_users',
      'can_edit_business_info',
      'can_delete_business'
    ];
  },

  /**
   * Obtiene plantillas de roles predeterminadas
   * @returns {Array} Lista de plantillas predeterminadas
   */
  getDefaultRoleTemplates() {
    return [
      {
        name: 'owner',
        display_name: 'Propietario',
        description: 'Acceso completo a todas las funciones',
        permissions: this.getAvailablePermissions().reduce((acc, perm) => {
          acc[perm] = true;
          return acc;
        }, {})
      },
      {
        name: 'manager',
        display_name: 'Gerente',
        description: 'Gestión de operaciones diarias',
        permissions: {
          can_view_dashboard: true,
          can_view_orders: true,
          can_manage_orders: true,
          can_view_inventory: true,
          can_manage_inventory: true,
          can_view_users: true,
          can_view_reports: true,
          can_manage_settings: false,
          can_view_finances: true,
          can_manage_roles: false,
          can_invite_users: true,
          can_remove_users: false,
          can_edit_business_info: false,
          can_delete_business: false
        }
      },
      {
        name: 'employee',
        display_name: 'Empleado',
        description: 'Acceso básico para empleados',
        permissions: {
          can_view_dashboard: true,
          can_view_orders: true,
          can_manage_orders: true,
          can_view_inventory: true,
          can_manage_inventory: false,
          can_view_users: false,
          can_view_reports: false,
          can_manage_settings: false,
          can_view_finances: false,
          can_manage_roles: false,
          can_invite_users: false,
          can_remove_users: false,
          can_edit_business_info: false,
          can_delete_business: false
        }
      },
      {
        name: 'viewer',
        display_name: 'Observador',
        description: 'Solo visualización de datos',
        permissions: {
          can_view_dashboard: true,
          can_view_orders: true,
          can_manage_orders: false,
          can_view_inventory: true,
          can_manage_inventory: false,
          can_view_users: false,
          can_view_reports: true,
          can_manage_settings: false,
          can_view_finances: false,
          can_manage_roles: false,
          can_invite_users: false,
          can_remove_users: false,
          can_edit_business_info: false,
          can_delete_business: false
        }
      }
    ];
  }
};

export default rolesService;